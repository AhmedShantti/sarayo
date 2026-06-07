import { Global, Module } from '@nestjs/common';
import { PricingService } from './pricing.service';

/**
 * Global so Cart and Orders can both inject PricingService without re-importing.
 */
@Global()
@Module({
  providers: [PricingService],
  exports: [PricingService],
})
export class PricingModule {}
