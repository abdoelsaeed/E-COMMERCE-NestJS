/* eslint-disable prettier/prettier */
import { PartialType } from '@nestjs/mapped-types';
import { CreateSubCategoryDto } from './create-sub-category.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateSubCategoryDto extends PartialType(CreateSubCategoryDto) {
  @ApiPropertyOptional({ description: 'اسم التصنيف الفرعي', minLength: 3, maxLength: 30, example: 'موبايلات' })
  name?: string;

  @ApiPropertyOptional({ description: 'معرف التصنيف الرئيسي (MongoId)', example: '60d21b4667d0d8992e610c85' })
  category?: string;
}
