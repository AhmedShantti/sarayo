import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsString, Max, Min } from 'class-validator';

export class AddCartItemDto {
  @ApiProperty({ description: 'Product id to add' })
  @IsString()
  productId: string;

  @ApiProperty({ example: 1, minimum: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(999)
  quantity: number;
}

export class UpdateCartItemDto {
  @ApiProperty({ example: 2, minimum: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(999)
  quantity: number;
}
