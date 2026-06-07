import { forwardRef, Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { PaymobModule } from './paymob.module';
import { OrdersModule } from '../orders/orders.module';

@Module({
  imports: [
    PaymobModule,
    // forwardRef resolves the Orders <-> Payments circular dependency.
    forwardRef(() => OrdersModule),
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService],
  exports: [PaymentsService],
})
export class PaymentsModule {}
