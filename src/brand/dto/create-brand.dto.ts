/* eslint-disable prettier/prettier */
import { IsOptional, IsUrl, MaxLength, MinLength } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBrandDto {
  @MinLength(3, { message: 'min length of name is 3' })
  @MaxLength(30, { message: 'max length of name is 30' })
  @ApiProperty({ description: 'اسم الماركة', minLength: 3, maxLength: 30, example: 'سامسونج' })
  name: string;

  @IsUrl({}, { message: 'image must be a Url' })
  @IsOptional()
  @ApiPropertyOptional({ description: 'رابط صورة الماركة', example: 'https://example.com/brand.png' })
  image: string;
}
