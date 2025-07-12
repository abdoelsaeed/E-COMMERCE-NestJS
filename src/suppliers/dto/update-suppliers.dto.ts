/* eslint-disable prettier/prettier */
import { PartialType } from '@nestjs/mapped-types';
import { CreateSupplierDto } from './create-suppliers.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateSupplierDto extends PartialType(CreateSupplierDto) {
  @ApiPropertyOptional({ description: 'اسم المورد', minLength: 3, maxLength: 30, example: 'شركة الموردين العرب' })
  name?: string;

  @ApiPropertyOptional({ description: 'رابط موقع المورد', example: 'https://supplier.com' })
  website?: string;
}
