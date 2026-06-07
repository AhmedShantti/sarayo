import {
  BadRequestException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TransactionStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { PaymobClient } from './paymob.client';
import { PaymobBillingData, PaymobItem } from './paymob.types';
import { OrdersService } from '../orders/orders.service';
import { RefundDto } from './dto/payment.dto';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly paymob: PaymobClient,
    private readonly config: ConfigService,
    @Inject(forwardRef(() => OrdersService))
    private readonly ordersService: OrdersService,
  ) {}

  // ──────────────────────────────────────────────
  // Initiate (3-step Paymob flow)
  // ──────────────────────────────────────────────

  async initiate(userId: string, orderId: string) {
    const order = await this.ordersService.getOrderEntity(orderId);
    if (!order) throw new NotFoundException('Order not found');
    if (order.userId !== userId) {
      throw new ForbiddenException('You do not have access to this order');
    }
    if (order.paymentStatus === 'PAID') {
      throw new BadRequestException('Order is already paid');
    }

    const currency = this.config.get<string>('paymob.currency') ?? 'EGP';
    const amountCents = this.toCents(Number(order.total));

    const items: PaymobItem[] = order.items.map((item) => ({
      name: item.productName,
      amount_cents: this.toCents(Number(item.price)),
      description: item.productName,
      quantity: item.quantity,
    }));

    const billingData = this.buildBillingData(order);

    const { paymobOrderId, paymentKey } = await this.paymob.initiatePayment(
      amountCents,
      currency,
      items,
      billingData,
      order.id, // merchant_order_id — links the callback back to our order
    );

    // Persist the Paymob order id on both the order and a pending Payment record.
    await this.ordersService.setPaymentIntent(order.id, String(paymobOrderId));
    await this.prisma.payment.upsert({
      where: { orderId: order.id },
      create: {
        orderId: order.id,
        paymobOrderId: String(paymobOrderId),
        amount: order.total,
        currency,
        status: TransactionStatus.PENDING,
      },
      update: {
        paymobOrderId: String(paymobOrderId),
        amount: order.total,
        currency,
        status: TransactionStatus.PENDING,
      },
    });

    const iframeId = this.config.get<string>('paymob.iframeId');
    const iframeUrl = `https://accept.paymob.com/api/acceptance/iframes/${iframeId}?payment_token=${paymentKey}`;

    return { paymentKey, iframeUrl, paymobOrderId };
  }

  // ──────────────────────────────────────────────
  // Server-to-server transaction callback (POST)
  // ──────────────────────────────────────────────

  /**
   * Processes the Paymob transaction callback. The HMAC arrives as a query
   * param; the transaction object is under `body.obj`. We verify HMAC, then
   * update the order + payment. Returns silently — the controller always 200s.
   */
  async handleTransactionCallback(body: any, hmac: string): Promise<void> {
    const obj = body?.obj ?? body;
    if (!obj) throw new BadRequestException('Empty callback payload');

    const hmacParams = this.flattenObjForHmac(obj);
    if (!this.paymob.verifyHmac(hmacParams, hmac)) {
      this.logger.warn('Rejected Paymob callback: HMAC verification failed');
      throw new UnauthorizedException('Invalid HMAC signature');
    }

    const success = obj.success === true || obj.success === 'true';
    const merchantOrderId: string | undefined = obj.order?.merchant_order_id;
    const paymobOrderId = String(obj.order?.id ?? '');
    const transactionId = String(obj.id ?? '');

    const order = await this.resolveOrder(merchantOrderId, paymobOrderId);
    if (!order) {
      this.logger.warn(`Paymob callback for unknown order (paymob=${paymobOrderId})`);
      return;
    }

    if (success) {
      await this.ordersService.markPaid(order.id);
      await this.prisma.payment.upsert({
        where: { orderId: order.id },
        create: {
          orderId: order.id,
          paymobOrderId,
          paymobTransactionId: transactionId,
          amount: order.total,
          currency: obj.currency ?? this.config.get('paymob.currency'),
          status: TransactionStatus.SUCCESS,
          metadata: this.safeMetadata(obj),
        },
        update: {
          paymobTransactionId: transactionId,
          status: TransactionStatus.SUCCESS,
          metadata: this.safeMetadata(obj),
        },
      });
      this.logger.log(`Order ${order.orderNumber} marked PAID (txn ${transactionId})`);
    } else {
      await this.ordersService.markPaymentFailed(order.id);
      await this.prisma.payment.upsert({
        where: { orderId: order.id },
        create: {
          orderId: order.id,
          paymobOrderId,
          paymobTransactionId: transactionId,
          amount: order.total,
          currency: obj.currency ?? this.config.get('paymob.currency'),
          status: TransactionStatus.FAILED,
          metadata: this.safeMetadata(obj),
        },
        update: {
          paymobTransactionId: transactionId,
          status: TransactionStatus.FAILED,
          metadata: this.safeMetadata(obj),
        },
      });
      this.logger.warn(`Order ${order.orderNumber} payment FAILED (txn ${transactionId})`);
    }
  }

  // ──────────────────────────────────────────────
  // Browser redirect callback (GET) — returns frontend URL
  // ──────────────────────────────────────────────

  async handleRedirectCallback(query: Record<string, any>): Promise<string> {
    const frontendUrl = this.config.get<string>('frontendUrl');
    const hmac = query.hmac;
    // GET callback params are already flat; verify with them directly.
    const valid = this.paymob.verifyHmac(query, hmac);

    const success = (query.success === 'true' || query.success === true) && valid;
    const merchantOrderId: string | undefined = query.merchant_order_id;
    const paymobOrderId = String(query.order ?? '');

    const order = await this.resolveOrder(merchantOrderId, paymobOrderId);
    const orderRef = order?.id ?? merchantOrderId ?? '';

    if (!valid) {
      this.logger.warn('Redirect callback HMAC verification failed');
    }

    const outcome = success ? 'success' : 'failed';
    return `${frontendUrl}/orders/${orderRef}?payment=${outcome}`;
  }

  // ──────────────────────────────────────────────
  // Refund (admin)
  // ──────────────────────────────────────────────

  async refund(dto: RefundDto) {
    const payment = await this.prisma.payment.findFirst({
      where: { paymobTransactionId: dto.transactionId },
      include: { order: true },
    });
    if (!payment) {
      throw new NotFoundException('No payment found for that transaction id');
    }

    const result = await this.paymob.refund(dto.transactionId, dto.amountCents);

    await this.prisma.payment.update({
      where: { id: payment.id },
      data: { status: TransactionStatus.REFUNDED, metadata: this.safeMetadata(result) },
    });
    await this.ordersService.markRefunded(payment.orderId);

    return { message: 'Refund processed', transactionId: dto.transactionId };
  }

  // ──────────────────────────────────────────────
  // Helpers
  // ──────────────────────────────────────────────

  private async resolveOrder(merchantOrderId?: string, paymobOrderId?: string) {
    if (merchantOrderId) {
      const byMerchant = await this.prisma.order.findUnique({ where: { id: merchantOrderId } });
      if (byMerchant) return byMerchant;
    }
    if (paymobOrderId) {
      return this.prisma.order.findFirst({ where: { paymentIntentId: paymobOrderId } });
    }
    return null;
  }

  private buildBillingData(order: any): PaymobBillingData {
    const addr = (order.shippingAddress ?? {}) as Record<string, any>;
    const fullName: string = addr.fullName ?? order.user?.name ?? 'Customer';
    const [firstName, ...rest] = fullName.trim().split(/\s+/);
    const lastName = rest.join(' ') || firstName;

    return {
      first_name: firstName || 'NA',
      last_name: lastName || 'NA',
      email: addr.email ?? order.user?.email ?? 'NA',
      phone_number: addr.phone ?? order.user?.phone ?? 'NA',
      apartment: 'NA',
      floor: 'NA',
      street: addr.street ?? 'NA',
      building: 'NA',
      shipping_method: 'PKG',
      postal_code: addr.postalCode ?? 'NA',
      city: addr.city ?? 'NA',
      country: addr.country ?? 'EG',
      state: addr.state ?? 'NA',
    };
  }

  /** Flatten Paymob's nested transaction object into the keys HMAC expects. */
  private flattenObjForHmac(obj: any): Record<string, any> {
    return {
      amount_cents: obj.amount_cents,
      created_at: obj.created_at,
      currency: obj.currency,
      error_occured: obj.error_occured,
      has_parent_transaction: obj.has_parent_transaction,
      id: obj.id,
      integration_id: obj.integration_id,
      is_3d_secure: obj.is_3d_secure,
      is_auth: obj.is_auth,
      is_capture: obj.is_capture,
      is_refunded: obj.is_refunded,
      is_standalone_payment: obj.is_standalone_payment,
      is_voided: obj.is_voided,
      order: obj.order?.id,
      owner: obj.owner,
      pending: obj.pending,
      'source_data.pan': obj.source_data?.pan,
      'source_data.sub_type': obj.source_data?.sub_type,
      'source_data.type': obj.source_data?.type,
      success: obj.success,
    };
  }

  /** Strip nothing sensitive here — Paymob obj has no card PAN beyond masked. */
  private safeMetadata(obj: any) {
    try {
      return JSON.parse(JSON.stringify(obj));
    } catch {
      return undefined;
    }
  }

  private toCents(amount: number): number {
    return Math.round(amount * 100);
  }
}
