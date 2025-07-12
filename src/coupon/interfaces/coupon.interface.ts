/* eslint-disable prettier/prettier */
import { Document } from 'mongoose';
export interface Coupon extends Document {
  name: string;
  expireDate: string;
  Discount:number;
}
