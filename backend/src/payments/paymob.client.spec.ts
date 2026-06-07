import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { PaymobClient } from './paymob.client';

const HMAC_SECRET = 'test-hmac-secret';

const config: Record<string, string> = {
  'paymob.baseUrl': 'https://accept.paymob.com/api',
  'paymob.apiKey': 'test-api-key',
  'paymob.integrationId': '12345',
  'paymob.hmacSecret': HMAC_SECRET,
  'paymob.currency': 'EGP',
};

// The exact field order Paymob expects, used to forge a valid signature.
const HMAC_FIELDS = [
  'amount_cents', 'created_at', 'currency', 'error_occured', 'has_parent_transaction',
  'id', 'integration_id', 'is_3d_secure', 'is_auth', 'is_capture', 'is_refunded',
  'is_standalone_payment', 'is_voided', 'order', 'owner', 'pending',
  'source_data.pan', 'source_data.sub_type', 'source_data.type', 'success',
];

function sign(params: Record<string, any>): string {
  const concatenated = HMAC_FIELDS.map((f) => {
    const v = params[f];
    if (v === null || v === undefined) return '';
    if (typeof v === 'boolean') return v ? 'true' : 'false';
    return String(v);
  }).join('');
  return crypto.createHmac('sha512', HMAC_SECRET).update(concatenated).digest('hex');
}

describe('PaymobClient.verifyHmac', () => {
  let client: PaymobClient;

  const sampleParams = {
    amount_cents: '5400',
    created_at: '2026-06-07T10:00:00',
    currency: 'EGP',
    error_occured: false,
    has_parent_transaction: false,
    id: '987654',
    integration_id: '12345',
    is_3d_secure: true,
    is_auth: false,
    is_capture: false,
    is_refunded: false,
    is_standalone_payment: true,
    is_voided: false,
    order: '555',
    owner: '42',
    pending: false,
    'source_data.pan': '2346',
    'source_data.sub_type': 'MasterCard',
    'source_data.type': 'card',
    success: true,
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        PaymobClient,
        { provide: ConfigService, useValue: { get: (k: string) => config[k] } },
      ],
    }).compile();
    client = moduleRef.get(PaymobClient);
  });

  it('accepts a correctly signed payload', () => {
    const hmac = sign(sampleParams);
    expect(client.verifyHmac(sampleParams, hmac)).toBe(true);
  });

  it('rejects a tampered payload', () => {
    const hmac = sign(sampleParams);
    const tampered = { ...sampleParams, amount_cents: '1' };
    expect(client.verifyHmac(tampered, hmac)).toBe(false);
  });

  it('rejects a missing signature', () => {
    expect(client.verifyHmac(sampleParams, '')).toBe(false);
  });
});
