import { forwardRef, Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { AdminOrdersController, OrdersController } from './orders.controller';
import { PaymentsModule } from '../payments/payments.module';

@Module({
  // forwardRef resolves the Orders <-> Payments circular dependency.
  imports: [forwardRef(() => PaymentsModule)],
  controllers: [OrdersController, AdminOrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
