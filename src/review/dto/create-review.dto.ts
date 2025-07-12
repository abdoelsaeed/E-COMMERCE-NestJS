/* eslint-disable prettier/prettier */
import { IsMongoId, IsNumber, IsOptional, IsString,  Max,  Min,  MinLength } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateReviewDto {
  @IsString({ message: 'review Text must be a string' })
  @IsOptional()
  @MinLength(3, { message: 'min length of review Text is 3' })
  @ApiPropertyOptional({ description: 'نص التقييم', minLength: 3, example: 'منتج رائع جداً' })
  reviewText: string;

  @IsNumber({}, { message: 'rating must be a number' })
  @Min(1, { message: 'min rate is 1' })
  @Max(5, { message: 'max rate is 5' })
  @ApiProperty({ description: 'تقييم المنتج من 1 إلى 5', minimum: 1, maximum: 5, example: 5 })
  rating: number;

  @IsString({ message: 'product must be a string' })
  @IsMongoId({ message: 'product must be a mongoId' })
  @ApiProperty({ description: 'معرف المنتج (MongoId)', example: '60d21b4667d0d8992e610c85' })
  product: string;
}
