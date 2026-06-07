import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty({ description: 'A valid refresh token issued at login.' })
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}
