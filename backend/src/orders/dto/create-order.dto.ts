import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';

export class ShippingAddressDto {
  @ApiProperty({ example: 'Mariam Hassan' })
  @IsString()
  @MaxLength(120)
  fullName: string;

  @ApiPropertyOptional({ example: 'customer@example.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ example: '+201001234567' })
  @IsString()
  @MaxLength(20)
  phone: string;

  @ApiProperty({ example: '12 Tahrir Street, Apt 4' })
  @IsString()
  @MaxLength(255)
  street: string;

  @ApiProperty({ example: 'Cairo' })
  @IsString()
  @MaxLength(100)
  city: string;

  @ApiPropertyOptional({ example: 'Cairo Governorate' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  state?: string;

  @ApiPropertyOptional({ example: 'Egypt', default: 'Egypt' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  country?: string;

  @ApiPropertyOptional({ example: '11511' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  postalCode?: string;
}

export class CreateOrderDto {
  @ApiProperty({ type: ShippingAddressDto })
  @ValidateNested()
  @Type(() => ShippingAddressDto)
  shippingAddress: ShippingAddressDto;

  @ApiPropertyOptional({ description: 'Optional order notes' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;
}
