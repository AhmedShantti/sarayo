/**
 * Typed configuration loaded once at bootstrap and read everywhere through
 * ConfigService — services must NEVER touch process.env directly.
 */
export interface AppConfig {
  nodeEnv: string;
  port: number;
  frontendUrl: string;
  dashboardUrl: string;
  databaseUrl: string;
  jwt: {
    accessSecret: string;
    refreshSecret: string;
    accessExpiry: string;
    refreshExpiry: string;
  };
  paymob: {
    apiKey: string;
    integrationId: string;
    iframeId: string;
    hmacSecret: string;
    currency: string;
    baseUrl: string;
  };
  uploads: {
    dest: string;
    maxFileSize: number;
  };
  business: {
    freeShippingThreshold: number;
    shippingCost: number;
    taxRate: number;
  };
}

export default (): AppConfig => ({
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: parseInt(process.env.PORT ?? '4000', 10),
  frontendUrl: process.env.FRONTEND_URL ?? 'http://localhost:3000',
  dashboardUrl: process.env.DASHBOARD_URL ?? 'http://localhost:3001',
  databaseUrl: process.env.DATABASE_URL ?? '',
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET ?? 'dev-access-secret-change-me-please-32chars',
    refreshSecret: process.env.JWT_REFRESH_SECRET ?? 'dev-refresh-secret-change-me-please-32chars',
    accessExpiry: process.env.JWT_ACCESS_EXPIRY ?? '15m',
    refreshExpiry: process.env.JWT_REFRESH_EXPIRY ?? '7d',
  },
  paymob: {
    apiKey: process.env.PAYMOB_API_KEY ?? '',
    integrationId: process.env.PAYMOB_INTEGRATION_ID ?? '',
    iframeId: process.env.PAYMOB_IFRAME_ID ?? '',
    hmacSecret: process.env.PAYMOB_HMAC_SECRET ?? '',
    currency: process.env.PAYMOB_CURRENCY ?? 'EGP',
    baseUrl: process.env.PAYMOB_BASE_URL ?? 'https://accept.paymob.com/api',
  },
  uploads: {
    dest: process.env.UPLOAD_DEST ?? './uploads',
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE ?? '5242880', 10),
  },
  business: {
    freeShippingThreshold: parseFloat(process.env.FREE_SHIPPING_THRESHOLD ?? '50'),
    shippingCost: parseFloat(process.env.SHIPPING_COST ?? '5.99'),
    taxRate: parseFloat(process.env.TAX_RATE ?? '0.10'),
  },
});
