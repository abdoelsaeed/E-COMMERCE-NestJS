/* eslint-disable prettier/prettier */
import { PartialType } from '@nestjs/mapped-types';
import { CreateRequestProductDto } from './create-requestProduct.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateRequestProductDto extends PartialType(CreateRequestProductDto) {
  @ApiPropertyOptional({ description: 'اسم المنتج المطلوب', minLength: 1, example: 'لاب توب' })
  titleNeed?: string;

  @ApiPropertyOptional({ description: 'تفاصيل الطلب', minLength: 5, example: 'أحتاج لاب توب بمواصفات عالية للألعاب.' })
  details?: string;

  @ApiPropertyOptional({ description: 'الكمية المطلوبة', minimum: 1, example: 2 })
  qauntity?: number;

  @ApiPropertyOptional({ description: 'معرف التصنيف (MongoId)', example: '60d21b4667d0d8992e610c85' })
  category?: string;
}
