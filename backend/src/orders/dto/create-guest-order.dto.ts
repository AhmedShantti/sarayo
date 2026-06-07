import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';

export class GuestOrderItemDto {
  @ApiPropertyOptional({ description: 'Backend product id (preferred)' })
  @IsOptional()
  @IsString()
  productId?: string;

  @ApiPropertyOptional({ description: 'Product SKU (used if productId is absent)' })
  @IsOptional()
  @IsString()
  sku?: string;

  @ApiProperty({ example: 2, minimum: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  quantity: number;
}

/**
 * Guest checkout — no authentication. The storefront posts the cart contents
 * plus contact info directly. A lightweight CUSTOMER user is created/reused
 * (keyed by email) so the order has an owner and shows up in the dashboard.
 */
export class CreateGuestOrderDto {
  @ApiProperty({ example: 'Mariam Hassan' })
  @IsString()
  @MaxLength(120)
  customer: string;

  @ApiPropertyOptional({ example: 'customer@example.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: '+201001234567' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;

  @ApiPropertyOptional({ example: '12 Tahrir Street, Cairo' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  address?: string;

  @ApiPropertyOptional({ example: 'card', description: 'card | cod | wallet' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  method?: string;

  @ApiProperty({ type: [GuestOrderItemDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => GuestOrderItemDto)
  items: GuestOrderItemDto[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;
}
