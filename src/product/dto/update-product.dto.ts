/* eslint-disable prettier/prettier */
import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @ApiPropertyOptional({ description: 'اسم المنتج', minLength: 3, example: 'هاتف سامسونج' })
  title?: string;

  @ApiPropertyOptional({ description: 'وصف المنتج', minLength: 20, example: 'هاتف ذكي بمواصفات عالية وسعر مناسب.' })
  description?: string;

  @ApiPropertyOptional({ description: 'الكمية المتوفرة', example: 10 })
  quantity?: number;

  @ApiPropertyOptional({ description: 'رابط صورة الغلاف', example: 'https://example.com/image.jpg' })
  imageCover?: string;

  @ApiPropertyOptional({ description: 'روابط صور إضافية', example: ['https://example.com/img1.jpg', 'https://example.com/img2.jpg'] })
  images?: string[];

  @ApiPropertyOptional({ description: 'عدد القطع المباعة', example: 5 })
  sold?: number;

  @ApiPropertyOptional({ description: 'سعر المنتج', minimum: 1, maximum: 20000, example: 1500 })
  price?: number;

  @ApiPropertyOptional({ description: 'السعر بعد الخصم', minimum: 1, maximum: 20000, example: 1200 })
  priceAfterDiscount?: number;

  @ApiPropertyOptional({ description: 'الألوان المتوفرة', example: ['أسود', 'أزرق'] })
  color?: string[];

  @ApiPropertyOptional({ description: 'معرف التصنيف (MongoId)', example: '60d21b4667d0d8992e610c85' })
  category?: string;

  @ApiPropertyOptional({ description: 'معرف التصنيف الفرعي (MongoId)', example: '60d21b4667d0d8992e610c99' })
  subCategory?: string;

  @ApiPropertyOptional({ description: 'معرف الماركة (MongoId)', example: '60d21b4667d0d8992e610c77' })
  brand?: string;

  @ApiPropertyOptional({ description: 'نسبة الخصم', example: 10 })
  discount?: number;
}
