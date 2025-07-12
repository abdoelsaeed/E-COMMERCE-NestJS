/* eslint-disable prettier/prettier */
import { IsMongoId, IsString, MaxLength, MinLength } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class CreateSubCategoryDto {
  @IsString({ message: 'name must be a string' })
  @MinLength(3, { message: 'min length of name is 3' })
  @MaxLength(30, { message: 'max length of name is 30' })
  @ApiProperty({ description: 'اسم التصنيف الفرعي', minLength: 3, maxLength: 30, example: 'موبايلات' })
  name: string;

  @IsString({ message: 'category must be a string' })
  @IsMongoId({ message: 'category must be a mongoId' })
  @ApiProperty({ description: 'معرف التصنيف الرئيسي (MongoId)', example: '60d21b4667d0d8992e610c85' })
  category: string;
}
