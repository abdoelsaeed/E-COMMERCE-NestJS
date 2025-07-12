/* eslint-disable prettier/prettier */
import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiPropertyOptional({ description: 'اسم المستخدم', minLength: 3, maxLength: 30, example: 'محمد أحمد' })
  name?: string;

  @ApiPropertyOptional({ description: 'كلمة المرور', minLength: 3, maxLength: 30, example: 'password123' })
  password?: string;

  @ApiPropertyOptional({ description: 'البريد الإلكتروني', example: 'user@email.com' })
  email?: string;

  @ApiPropertyOptional({ description: 'العمر', example: 25 })
  age?: number;

  @ApiPropertyOptional({ description: 'رقم الهاتف', example: '+201234567890' })
  phone_number?: string;

  @ApiPropertyOptional({ description: 'العنوان', example: 'القاهرة، مصر' })
  address?: string;

  @ApiPropertyOptional({ description: 'الدور', enum: ['User', 'Admin'], example: 'User' })
  role?: string;

  @ApiPropertyOptional({ description: 'رابط الصورة الشخصية', example: 'https://example.com/avatar.png' })
  avatar?: string;

  @ApiPropertyOptional({ description: 'هل المستخدم نشط؟', example: true })
  active?: boolean;

  @ApiPropertyOptional({ description: 'كود التحقق', minLength: 6, maxLength: 6, example: '123456' })
  verification_Code?: string;

  @ApiPropertyOptional({ description: 'الجنس', enum: ['female', 'male'], example: 'male' })
  gender?: string;
}
