import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateAddressDto {
  @ApiProperty({ example: 'Home' })
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  label: string;

  @ApiProperty({ example: '12 Tahrir Street, Apt 4' })
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  street: string;

  @ApiProperty({ example: 'Cairo' })
  @IsString()
  @MaxLength(100)
  city: string;

  @ApiProperty({ example: 'Cairo Governorate' })
  @IsString()
  @MaxLength(100)
  state: string;

  @ApiProperty({ example: 'Egypt' })
  @IsString()
  @MaxLength(100)
  country: string;

  @ApiProperty({ example: '11511' })
  @IsString()
  @MaxLength(20)
  postalCode: string;

  @ApiPropertyOptional({ example: '+201001234567' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}

export class UpdateAddressDto extends PartialType(CreateAddressDto) {}
