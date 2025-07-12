/* eslint-disable prettier/prettier */
import { PartialType } from '@nestjs/mapped-types';
import { CreateReviewDto } from './create-review.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateReviewDto extends PartialType(CreateReviewDto) {
  @ApiPropertyOptional({ description: 'نص التقييم', minLength: 3, example: 'منتج جيد' })
  reviewText?: string;

  @ApiPropertyOptional({ description: 'تقييم المنتج من 1 إلى 5', minimum: 1, maximum: 5, example: 4 })
  rating?: number;

  @ApiPropertyOptional({ description: 'معرف المنتج (MongoId)', example: '60d21b4667d0d8992e610c85' })
  product?: string;
}
