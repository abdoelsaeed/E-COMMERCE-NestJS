/* eslint-disable prettier/prettier */
import { IsOptional, IsString, IsUrl, MaxLength, MinLength } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCategoryDto {
    @IsString({ message: 'name must be a string' })
    @MinLength(3, { message: 'min length of name is 3' })
    @MaxLength(30, { message: 'max length of name is 30' })
    @ApiProperty({ description: 'اسم التصنيف', minLength: 3, maxLength: 30, example: 'إلكترونيات' })
    name:string;

    @IsUrl({}, { message: 'image must be a Url' })
    @IsOptional()
    @ApiPropertyOptional({ description: 'رابط صورة التصنيف', example: 'https://example.com/category.png' })
    image:string;
}
