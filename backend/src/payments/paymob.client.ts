import { Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import * as crypto from 'crypto';
import {
  InitiatePaymentResult,
  PaymobBillingData,
  PaymobItem,
} from './paymob.types';

/**
 * Thin wrapper around Paymob's Accept API. There is no official Node SDK, so we
 * use axios for the 3-step server-side flow:
 *   1. auth token  2. register order  3. payment key
 *
 * Amounts are always handled in piasters (EGP * 100) as integers.
 */
@Injectable()
export class PaymobClient {
  private readonly logger = new Logger(PaymobClient.name);
  private readonly http: AxiosInstance;

  private readonly apiKey: string;
  private readonly integrationId: string;
  private readonly hmacSecret: string;

  constructor(private readonly config: ConfigService) {
    const baseURL = this.config.get<string>('paymob.baseUrl');
    this.apiKey = this.config.get<string>('paymob.apiKey') ?? '';
    this.integrationId = this.config.get<string>('paymob.integrationId') ?? '';
    this.hmacSecret = this.config.get<string>('paymob.hmacSecret') ?? '';

    this.http = axios.create({
      baseURL,
      timeout: 15_000,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // ──────────────────────────────────────────────
  // Step 1 — Authentication token
  // ──────────────────────────────────────────────
  async getAuthToken(): Promise<string> {
    if (!this.apiKey) {
      throw new ServiceUnavailableException('Paymob API key is not configured');
    }
    try {
      const { data } = await this.http.post('/auth/tokens', { api_key: this.apiKey });
      return data.token as string;
    } catch (err) {
      this.handleError('auth token', err);
    }
  }

  // ──────────────────────────────────────────────
  // Step 2 — Register order
  // ──────────────────────────────────────────────
  async registerOrder(
    token: string,
    amountCents: number,
    currency: string,
    items: PaymobItem[],
    merchantOrderId?: string,
  ): Promise<number> {
    try {
      const { data } = await this.http.post('/ecommerce/orders', {
        auth_token: token,
        delivery_needed: false,
        amount_cents: amountCents,
        currency,
        merchant_order_id: merchantOrderId,
        items,
      });
      return data.id as number;
    } catch (err) {
      this.handleError('register order', err);
    }
  }

  // ──────────────────────────────────────────────
  // Step 3 — Payment key
  // ──────────────────────────────────────────────
  async getPaymentKey(
    token: string,
    paymobOrderId: number,
    amountCents: number,
    currency: string,
    billingData: PaymobBillingData,
  ): Promise<string> {
    if (!this.integrationId) {
      throw new ServiceUnavailableException('Paymob integration id is not configured');
    }
    try {
      const { data } = await this.http.post('/acceptance/payment_keys', {
        auth_token: token,
        amount_cents: amountCents,
        expiration: 3600,
        order_id: paymobOrderId,
        billing_data: billingData,
        currency,
        integration_id: Number(this.integrationId),
        lock_order_when_paid: true,
      });
      return data.token as string;
    } catch (err) {
      this.handleError('payment key', err);
    }
  }

  // ──────────────────────────────────────────────
  // Convenience — run all 3 steps
  // ──────────────────────────────────────────────
  async initiatePayment(
    amountCents: number,
    currency: string,
    items: PaymobItem[],
    billingData: PaymobBillingData,
    merchantOrderId?: string,
  ): Promise<InitiatePaymentResult> {
    const token = await this.getAuthToken();
    const paymobOrderId = await this.registerOrder(
      token,
      amountCents,
      currency,
      items,
      merchantOrderId,
    );
    const paymentKey = await this.getPaymentKey(
      token,
      paymobOrderId,
      amountCents,
      currency,
      billingData,
    );
    return { paymobOrderId, paymentKey };
  }

  // ──────────────────────────────────────────────
  // Refund
  // ──────────────────────────────────────────────
  async refund(transactionId: string, amountCents: number): Promise<any> {
    const token = await this.getAuthToken();
    try {
      const { data } = await this.http.post('/acceptance/void_refund/refund', {
        auth_token: token,
        transaction_id: transactionId,
        amount_cents: amountCents,
      });
      return data;
    } catch (err) {
      this.handleError('refund', err);
    }
  }

  // ──────────────────────────────────────────────
  // HMAC verification (SHA512)
  // ──────────────────────────────────────────────

  /**
   * Verify the HMAC Paymob sends with every callback. The fields must be
   * concatenated in this exact order, then HMAC-SHA512'd with the merchant
   * secret. Never process a callback that fails this check.
   */
  verifyHmac(params: Record<string, any>, receivedHmac: string): boolean {
    if (!receivedHmac || !this.hmacSecret) return false;

    const hmacFields = [
      'amount_cents',
      'created_at',
      'currency',
      'error_occured',
      'has_parent_transaction',
      'id',
      'integration_id',
      'is_3d_secure',
      'is_auth',
      'is_capture',
      'is_refunded',
      'is_standalone_payment',
      'is_voided',
      'order',
      'owner',
      'pending',
      'source_data.pan',
      'source_data.sub_type',
      'source_data.type',
      'success',
    ];

    const concatenated = hmacFields.map((f) => this.normalize(params[f])).join('');
    const computed = crypto
      .createHmac('sha512', this.hmacSecret)
      .update(concatenated)
      .digest('hex');

    // Constant-time comparison to avoid timing attacks.
    try {
      return crypto.timingSafeEqual(
        Buffer.from(computed, 'hex'),
        Buffer.from(receivedHmac, 'hex'),
      );
    } catch {
      return false;
    }
  }

  /** Paymob expects booleans as "true"/"false" strings and nullish as "". */
  private normalize(value: any): string {
    if (value === null || value === undefined) return '';
    if (typeof value === 'boolean') return value ? 'true' : 'false';
    return String(value);
  }

  private handleError(step: string, err: unknown): never {
    const detail = axios.isAxiosError(err)
      ? JSON.stringify(err.response?.data ?? err.message)
      : (err as Error).message;
    // Never log API keys; only the failing step + Paymob's error payload.
    this.logger.error(`Paymob ${step} failed: ${detail}`);
    throw new ServiceUnavailableException(`Paymob ${step} request failed`);
  }
}
