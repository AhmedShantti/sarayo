import { forwardRef, Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { AdminPaymentsController, PaymentsController } from './payments.controller';
import { PaymobModule } from './paymob.module';
import { OrdersModule } from '../orders/orders.module';

@Module({
  imports: [
    PaymobModule,
    // forwardRef resolves the Orders <-> Payments circular dependency.
    forwardRef(() => OrdersModule),
  ],
  controllers: [PaymentsController, AdminPaymentsController],
  providers: [PaymentsService],
  exports: [PaymentsService],
})
export class PaymentsModule {}
