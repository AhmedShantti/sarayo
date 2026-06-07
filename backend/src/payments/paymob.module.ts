import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PaymobClient } from './paymob.client';

/**
 * Provides the PaymobClient. ConfigModule is global, but we import it here too
 * for clarity / standalone use. Exported so PaymentsModule can inject the client.
 */
@Module({
  imports: [ConfigModule],
  providers: [PaymobClient],
  exports: [PaymobClient],
})
export class PaymobModule {}
