/* eslint-disable prettier/prettier */
import { IsOptional, IsString, IsNumber, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCartDto {
  @IsOptional()
  @IsNumber({}, {message:'the quantity must be a number'})
  @Min(1,{message:'the quantity must be greater than 0'})
  @ApiPropertyOptional({ description: 'الكمية الجديدة للمنتج في العربة', minimum: 1, example: 2 })
  quantity: number;

  @IsOptional()
  @IsString({message:'the color must be a string'})
  @ApiPropertyOptional({ description: 'لون المنتج في العربة', example: 'red' })
  color: string;
}
