/* eslint-disable prettier/prettier */
import { Document, ObjectId } from 'mongoose';
export interface Order extends Document {
  user:ObjectId;
  cartItems:any;
  taxPrice:number;
  shippingPrice:number;
  totalOrderPrice:number;
  paymentMethodType:string;
  isPaid:boolean;
  paidAt:Date;
  delieverdAt:Date;
  isDelieverd:boolean;
  shippingAddress:any;
}
