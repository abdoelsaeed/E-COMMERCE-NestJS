/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { IsDateString, IsNumber, IsOptional, IsString, IsUrl, MaxLength, Min, MinDate, MinLength, Validate } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class CreateSupplierDto {
  @IsString({ message: 'name must be a string' })
  @MinLength(3, { message: 'min length of name is 3' })
  @MaxLength(30, { message: 'max length of name is 30' })
  @ApiProperty({ description: 'اسم المورد', minLength: 3, maxLength: 30, example: 'شركة الموردين العرب' })
  name: string;
  @IsString({ message: 'website must be a string' })
  @IsUrl({}, { message: 'website must be a Url' })
  @ApiProperty({ description: 'رابط موقع المورد', example: 'https://supplier.com' })
  website: string;
}
