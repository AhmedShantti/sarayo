import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ example: 'SAR-001' })
  @IsString()
  @MaxLength(40)
  sku: string;

  @ApiProperty({ example: 'Cheddar & Sour Cream' })
  @IsString()
  @MinLength(2)
  @MaxLength(150)
  name: string;

  @ApiPropertyOptional({ example: 'شيدر وكريمة حامضة' })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  nameAr?: string;

  @ApiPropertyOptional({ description: 'Auto-generated from name when omitted' })
  @IsOptional()
  @IsString()
  @MaxLength(170)
  slug?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  descriptionAr?: string;

  @ApiProperty({ example: 18 })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  price: number;

  @ApiPropertyOptional({ example: 22 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  compareAtPrice?: number;

  @ApiProperty({ example: 124 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  stock: number;

  @ApiPropertyOptional({ type: [String], example: ['/lays-cheddar.png'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @ApiPropertyOptional({ example: 'cheese' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  flavor?: string;

  @ApiPropertyOptional({ example: '113g' })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  weight?: string;

  @ApiPropertyOptional({ example: 'package', enum: ['piece', 'package'], default: 'package' })
  @IsOptional()
  @IsIn(['piece', 'package'])
  sellingUnit?: string;

  @ApiPropertyOptional({ example: 12, description: 'Bags per package (when sold by package)' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  packageSize?: number;

  @ApiPropertyOptional({ example: 216, description: 'Price for one full package; defaults to price × packageSize' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  packagePrice?: number;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @ApiProperty({ description: 'Category id this product belongs to' })
  @IsString()
  categoryId: string;
}
