/* eslint-disable prettier/prettier */
import { IsArray, IsMongoId, IsNumber, IsOptional, IsString, IsUrl, Max, Min, MinLength } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductDto {
  @IsString({ message: 'title must be a string' })
  @MinLength(3, { message: 'min length of title is 3' })
  @ApiProperty({ description: 'اسم المنتج', minLength: 3, example: 'هاتف سامسونج' })
  title: string;

  @IsString({ message: 'description must be a string' })
  @MinLength(20, { message: 'min length of description is 20' })
  @ApiProperty({ description: 'وصف المنتج', minLength: 20, example: 'هاتف ذكي بمواصفات عالية وسعر مناسب.' })
  description: string;

  @IsNumber({}, { message: 'quantity must be a number' })
  @IsOptional()
  @ApiPropertyOptional({ description: 'الكمية المتوفرة', example: 10 })
  // @Min(1,{message:'min Quantity is 1'})
  quantity: number;

  @IsString({ message: 'imageCover must be a string' })
  @IsUrl({}, { message: 'imageCover must be a URL' })
  @ApiProperty({ description: 'رابط صورة الغلاف', example: 'https://example.com/image.jpg' })
  imageCover: string;

  @IsArray({ message: 'images must be a string' })
  @IsOptional()
  @ApiPropertyOptional({ description: 'روابط صور إضافية', example: ['https://example.com/img1.jpg', 'https://example.com/img2.jpg'] })
  images: string[];

  @IsNumber({}, { message: 'sold must be a number' })
  @IsOptional()
  @ApiPropertyOptional({ description: 'عدد القطع المباعة', example: 5 })
  sold: number;

  @IsNumber({}, { message: 'price must be a number' })
  @Min(1, { message: 'min price is 1' })
  @Max(20000, { message: 'max price is 20000' })
  @ApiProperty({ description: 'سعر المنتج', minimum: 1, maximum: 20000, example: 1500 })
  price: number;

  @IsNumber({}, { message: 'priceAfterDiscount must be a number' })
  @IsOptional()
  @Min(1, { message: 'min price is 1' })
  @Max(20000, { message: 'max price is 20000' })
  @ApiPropertyOptional({ description: 'السعر بعد الخصم', minimum: 1, maximum: 20000, example: 1200 })
  priceAfterDiscount: number;

  @IsArray({ message: 'color must be a array' })
  @IsOptional()
  @ApiPropertyOptional({ description: 'الألوان المتوفرة', example: ['أسود', 'أزرق'] })
  color: string[];

  @IsString({ message: 'category must be a string' })
  @IsMongoId({ message: 'Category must be a mongoID' })
  @ApiProperty({ description: 'معرف التصنيف (MongoId)', example: '60d21b4667d0d8992e610c85' })
  category: string;

  @IsString({ message: 'subCategory must be a string' })
  @IsMongoId({ message: 'subCategory must be a mongoID' })
  @IsOptional()
  @ApiPropertyOptional({ description: 'معرف التصنيف الفرعي (MongoId)', example: '60d21b4667d0d8992e610c99' })
  subCategory: string;

  @IsString({ message: 'brand must be a string' })
  @IsMongoId({ message: 'brand must be a mongoID' })
  @IsOptional()
  @ApiPropertyOptional({ description: 'معرف الماركة (MongoId)', example: '60d21b4667d0d8992e610c77' })
  brand: string;

  @IsNumber({}, { message: 'discount must be a number' })
  @IsOptional()
  @ApiPropertyOptional({ description: 'نسبة الخصم', example: 10 })
  discount: number;
}
