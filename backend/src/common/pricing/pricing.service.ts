import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface PriceBreakdown {
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
}

/**
 * Centralises the store's shipping + tax business rules so the cart summary and
 * order creation always agree. All thresholds come from config (env).
 */
@Injectable()
export class PricingService {
  constructor(private readonly config: ConfigService) {}

  calculate(subtotal: number): PriceBreakdown {
    const threshold = this.config.get<number>('business.freeShippingThreshold') ?? 50;
    const flatShipping = this.config.get<number>('business.shippingCost') ?? 5.99;
    const taxRate = this.config.get<number>('business.taxRate') ?? 0.1;

    const shippingCost = subtotal >= threshold || subtotal === 0 ? 0 : flatShipping;
    const tax = this.round(subtotal * taxRate);
    const total = this.round(subtotal + shippingCost + tax);

    return {
      subtotal: this.round(subtotal),
      shippingCost: this.round(shippingCost),
      tax,
      total,
    };
  }

  private round(value: number): number {
    return Math.round((value + Number.EPSILON) * 100) / 100;
  }
}
