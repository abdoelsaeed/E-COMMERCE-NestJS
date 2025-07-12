/* eslint-disable prettier/prettier */
import { IsNumber, } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class CreateTaxDto {
  @IsNumber({}, { message: 'texPrice must be a Number' })
  @ApiProperty({ description: 'قيمة الضريبة', example: 15 })
  texPrice: number;

  @IsNumber({}, { message: 'shippingPrice must be a Number' })
  @ApiProperty({ description: 'قيمة الشحن', example: 50 })
  shippingPrice: number;
}
