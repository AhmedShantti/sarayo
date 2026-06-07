import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsString, Min } from 'class-validator';

export class InitiatePaymentDto {
  @ApiProperty({ description: 'Order id to pay for' })
  @IsString()
  orderId: string;
}

export class RefundDto {
  @ApiProperty({ description: 'Paymob transaction id to refund' })
  @IsString()
  transactionId: string;

  @ApiProperty({ description: 'Amount to refund, in piasters (EGP * 100)' })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  amountCents: number;
}
