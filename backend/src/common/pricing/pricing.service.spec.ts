import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { PricingService } from './pricing.service';

describe('PricingService', () => {
  let service: PricingService;

  const configValues: Record<string, number> = {
    'business.freeShippingThreshold': 50,
    'business.shippingCost': 5.99,
    'business.taxRate': 0.1,
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        PricingService,
        {
          provide: ConfigService,
          useValue: { get: (key: string) => configValues[key] },
        },
      ],
    }).compile();

    service = moduleRef.get(PricingService);
  });

  it('charges flat shipping under the free-shipping threshold', () => {
    const result = service.calculate(36);
    expect(result.subtotal).toBe(36);
    expect(result.shippingCost).toBe(5.99);
    expect(result.tax).toBe(3.6);
    expect(result.total).toBe(45.59);
  });

  it('gives free shipping at or above the threshold', () => {
    const result = service.calculate(54);
    expect(result.shippingCost).toBe(0);
    expect(result.tax).toBe(5.4);
    expect(result.total).toBe(59.4);
  });

  it('returns zeroes (no shipping) for an empty cart', () => {
    const result = service.calculate(0);
    expect(result).toEqual({ subtotal: 0, shippingCost: 0, tax: 0, total: 0 });
  });
});
