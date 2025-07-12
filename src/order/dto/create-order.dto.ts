/* eslint-disable prettier/prettier */
import { IsObject, IsOptional} from "class-validator";

export class CreateOrderDto {
  @IsObject({ message: 'shippingAddress must be a object' })
  @IsOptional()
  shippingAddress: object;
  @IsOptional()
  isPaid: boolean;
  @IsOptional()
  paidAt: Date;
  @IsOptional()
  isDelieverd: boolean;
  @IsOptional()
  deliverdAt: Date;
}
