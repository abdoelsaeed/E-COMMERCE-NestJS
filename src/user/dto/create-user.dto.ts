/* eslint-disable prettier/prettier */
import { IsBoolean, IsEmail, IsEnum, IsNumber, IsOptional, IsPhoneNumber, IsString, IsUrl, Length, MaxLength, MinLength } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
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

  @IsNumber({}, { message: 'age must be a number' })
  @IsOptional()
  @ApiPropertyOptional({ description: 'العمر', example: 25 })
  age?: number;

  @IsString({ message: 'phone_number must be a string' })
  @IsPhoneNumber('EG', { message: 'phone_number must be a valid phone number' })
  @IsOptional()
  @ApiPropertyOptional({ description: 'رقم الهاتف', example: '+201234567890' })
  phone_number?: string;

  @IsString({ message: 'adress must be a string' })
  @IsOptional()
  @ApiPropertyOptional({ description: 'العنوان', example: 'القاهرة، مصر' })
  address?: string;

  @IsEnum(['User', 'Admin'], { message: 'role must be a Admin or User' })
  @IsOptional()
  @ApiPropertyOptional({ description: 'الدور', enum: ['User', 'Admin'], example: 'User' })
  role: string;

  @IsUrl({}, { message: 'avatar must be a Url' })
  @IsOptional()
  @ApiPropertyOptional({ description: 'رابط الصورة الشخصية', example: 'https://example.com/avatar.png' })
  avatar: string;

  @IsBoolean({ message: 'active must be a true or false' })
  @IsEnum([true, false], { message: 'active must be a true or false' })
  @IsOptional()
  @ApiPropertyOptional({ description: 'هل المستخدم نشط؟', example: true })
  active: boolean;

  @IsString({ message: 'verification_Code must be a string' })
  @IsOptional()
  @Length(6, 6, { message: 'verification_Code must be 6 characters' })
  @ApiPropertyOptional({ description: 'كود التحقق', minLength: 6, maxLength: 6, example: '123456' })
  verification_Code?: string;

  @IsString({ message: 'gender must be a string' })
  @IsEnum(['female', 'male'], { message: 'gender must be a true or false' })
  @IsOptional()
  @ApiPropertyOptional({ description: 'الجنس', enum: ['female', 'male'], example: 'male' })
  gender: string;
}
