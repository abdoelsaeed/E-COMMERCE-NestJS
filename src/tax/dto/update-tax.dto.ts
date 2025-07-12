/* eslint-disable prettier/prettier */
import { PartialType } from '@nestjs/mapped-types';
import { CreateTaxDto } from './create-tax.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateTaxDto extends PartialType(CreateTaxDto) {
  @ApiPropertyOptional({ description: 'قيمة الضريبة', example: 15 })
  texPrice?: number;

  @ApiPropertyOptional({ description: 'قيمة الشحن', example: 50 })
  shippingPrice?: number;
}
