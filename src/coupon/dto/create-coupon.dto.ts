/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { IsDateString, IsNumber, MaxLength, Min, MinDate, MinLength, Validate } from "class-validator";
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

@ValidatorConstraint({ name: 'IsFutureDate', async: false })
export class IsFutureDate implements ValidatorConstraintInterface {
  validate(date: string, args: ValidationArguments) {
    const now = new Date();
    const inputDate = new Date(date);

    // تجاهل الوقت والتحقق فقط من التاريخ
    const nowDateOnly = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );
    const inputDateOnly = new Date(
      inputDate.getFullYear(),
      inputDate.getMonth(),
      inputDate.getDate(),
    );

    return inputDateOnly >= nowDateOnly; // السماح بتاريخ اليوم أو المستقبل
  }
  defaultMessage(args: ValidationArguments) {
    return 'expireDate must be in the future';
  }
}

export class CreateCouponDto {
  @MinLength(3, { message: 'min length of name is 3' })
  @MaxLength(30, { message: 'max length of name is 30' })
  @ApiProperty({ description: 'اسم الكوبون', minLength: 3, maxLength: 30, example: 'SUMMER2024' })
  name: string;
  @IsDateString({}, { message: 'expireDate must be a valid date string' })
  @Validate(IsFutureDate)
  @ApiProperty({ description: 'تاريخ انتهاء الكوبون (يجب أن يكون في المستقبل)', example: '2024-12-31' })
  expireDate: Date;
  @IsNumber({}, { message: 'discount must a number' })
  @Min(0, { message: 'discount must be bigger than 0' })
  @ApiProperty({ description: 'نسبة الخصم', minimum: 0, example: 20 })
  discount: number;
}
