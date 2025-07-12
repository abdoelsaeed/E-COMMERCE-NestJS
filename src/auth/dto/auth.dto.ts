/* eslint-disable prettier/prettier */
import { IsString, MinLength, MaxLength, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAuthDto {
  @IsString({ message: 'name must be a string' })
  @MinLength(3, { message: 'min length of name is 3' })
  @MaxLength(30, { message: 'max length of name is 30' })
  @ApiProperty({ description: 'اسم المستخدم', minLength: 3, maxLength: 30, example: 'محمد أحمد' })
  name: string;

  @IsString({ message: 'password must be a string' })
  @MinLength(3, { message: 'min length of password is 3' })
  @MaxLength(30, { message: 'max length of password is 30' })
  @ApiProperty({ description: 'كلمة المرور', minLength: 3, maxLength: 30, example: 'password123' })
  password: string;

  @IsString({ message: 'email must be a string' })
  @IsEmail({}, { message: 'email must be a valid email' })
  @MinLength(0, { message: 'email is required' })
  @ApiProperty({ description: 'البريد الإلكتروني', example: 'user@email.com' })
  email: string;
}

export class SignInDto {
  @IsString({ message: 'password must be a string' })
  @MinLength(3, { message: 'min length of password is 3' })
  @MaxLength(30, { message: 'max length of password is 30' })
  @ApiProperty({ description: 'كلمة المرور', minLength: 3, maxLength: 30, example: 'password123' })
  password: string;

  @IsString({ message: 'email must be a string' })
  @IsEmail({}, { message: 'email must be a valid email' })
  @MinLength(0, { message: 'email is required' })
  @ApiProperty({ description: 'البريد الإلكتروني', example: 'user@email.com' })
  email: string;
}