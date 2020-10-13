import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ForgotPasswordDto {
  @ApiProperty({ description: 'The email of user.' })
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
