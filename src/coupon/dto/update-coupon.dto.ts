/* eslint-disable prettier/prettier */
import { PartialType } from '@nestjs/mapped-types';
import { CreateCouponDto } from './create-coupon.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCouponDto extends PartialType(CreateCouponDto) {
  @ApiPropertyOptional({ description: 'اسم الكوبون', minLength: 3, maxLength: 30, example: 'SUMMER2024' })
  name?: string;

  @ApiPropertyOptional({ description: 'تاريخ انتهاء الكوبون (يجب أن يكون في المستقبل)', example: '2024-12-31' })
  expireDate?: Date;

  @ApiPropertyOptional({ description: 'نسبة الخصم', minimum: 0, example: 20 })
  discount?: number;
}
