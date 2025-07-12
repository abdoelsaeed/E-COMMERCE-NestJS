/* eslint-disable prettier/prettier */
import { PartialType } from '@nestjs/mapped-types';
import { CreateBrandDto } from './create-brand.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateBrandDto extends PartialType(CreateBrandDto) {
  @ApiPropertyOptional({ description: 'اسم الماركة', minLength: 3, maxLength: 30, example: 'سامسونج' })
  name?: string;

  @ApiPropertyOptional({ description: 'رابط صورة الماركة', example: 'https://example.com/brand.png' })
  image?: string;
}
