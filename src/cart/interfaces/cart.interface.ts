/* eslint-disable prettier/prettier */
import { Document, ObjectId } from 'mongoose';
export interface Cart extends Document {
  cartItem: [];
  totalPrice: number;
  totalPriceAfterDiscount: number;
  Coupons: [];
  user: ObjectId;
}
