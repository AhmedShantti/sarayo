import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'customer@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Passw0rd!', minLength: 8 })
  @IsString()
  @MinLength(8)
  @MaxLength(72) // bcrypt truncates beyond 72 bytes
  @Matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message: 'Password must contain upper, lower case letters and a number',
  })
  password: string;

  @ApiProperty({ example: 'Mariam Hassan' })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({ example: 'مريم حسن' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  nameAr?: string;

  @ApiPropertyOptional({ example: '+201001234567' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;
}
