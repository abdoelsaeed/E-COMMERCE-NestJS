/* eslint-disable prettier/prettier */
import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryDto } from './create-category.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
    @ApiPropertyOptional({ description: 'اسم التصنيف', minLength: 3, maxLength: 30, example: 'إلكترونيات' })
    name?: string;

    @ApiPropertyOptional({ description: 'رابط صورة التصنيف', example: 'https://example.com/category.png' })
    image?: string;
}
