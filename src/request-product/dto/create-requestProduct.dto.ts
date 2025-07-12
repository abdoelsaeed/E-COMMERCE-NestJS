/* eslint-disable prettier/prettier */
import { IsNumber, IsOptional, IsString, Min, MinLength } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRequestProductDto {
  @IsString({ message: 'titleNeed must be a string' })
  @MinLength(0, { message: 'titleNeed is required' })
  @ApiProperty({ description: 'اسم المنتج المطلوب', minLength: 1, example: 'لاب توب' })
  titleNeed: string;

  @IsString({ message: 'details must be a string' })
  @MinLength(5, { message: 'details must be bigger than 5 character' })
  @ApiProperty({ description: 'تفاصيل الطلب', minLength: 5, example: 'أحتاج لاب توب بمواصفات عالية للألعاب.' })
  details: string;

  @IsNumber({}, { message: 'qauntity must be a number' })
  @Min(1, { message: 'qauntity must be bigger than 1' })
  @ApiProperty({ description: 'الكمية المطلوبة', minimum: 1, example: 2 })
  qauntity: number;

  @IsString({ message: 'category must be a string' })
  @IsOptional()
  @ApiPropertyOptional({ description: 'معرف التصنيف (MongoId)', example: '60d21b4667d0d8992e610c85' })
  category: string;

//   @MinLength(0, { message: 'titleNeed is required' })
//   @IsString({ message: 'user must be a string' })
//   @IsMongoId({ message: 'user must be a valid mongo ID' })
//   user: string;
}
