import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';
import { CreateProductDto } from './create-product.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {}

export class UpdateStockDto {
  @ApiProperty({ example: 200, description: 'Absolute new stock quantity' })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  stock: number;
}
