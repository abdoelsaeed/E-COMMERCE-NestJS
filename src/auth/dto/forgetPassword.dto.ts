/* eslint-disable prettier/prettier */
import { IsString, MinLength, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ForgetPasswordDto {

  @IsString({ message: 'email must be a string' })
  @IsEmail({}, { message: 'email must be a valid email' })
  @MinLength(0, { message: 'email is required' })
  @ApiProperty({ description: 'البريد الإلكتروني', example: 'user@email.com' })
  email: string;
}
