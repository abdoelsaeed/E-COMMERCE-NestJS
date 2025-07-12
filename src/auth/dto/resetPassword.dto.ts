/* eslint-disable prettier/prettier */
import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @IsString({ message: 'email must be a string' })
  @IsEmail({}, { message: 'email must be a valid email' })
  @MinLength(0, { message: 'email is required' })
  @ApiProperty({ description: 'البريد الإلكتروني', example: 'user@email.com' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'كود التحقق', example: '123456' })
  verification_Code: string;

  @IsString({ message: 'password must be a string' })
  @MinLength(3, { message: 'min length of password is 3' })
  @MaxLength(30, { message: 'max length of password is 30' })
  @ApiProperty({ description: 'كلمة المرور الجديدة', minLength: 3, maxLength: 30, example: 'newPassword123' })
  newPassword: string;
}
