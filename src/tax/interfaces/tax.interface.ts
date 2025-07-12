/* eslint-disable prettier/prettier */
import { Document } from 'mongoose';
export interface Tax extends Document {
  texPrice: number;
  shippingPrice: number;
}
