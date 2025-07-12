/* eslint-disable prettier/prettier */
import { Document, ObjectId } from 'mongoose';
export interface Product extends Document {
  title: string;
  description: string;
  quantity: number;
  imageCover: string;
  images: string[];
  sold: number;
  price: number;
  priceAfterDiscount: number;
  color: string[];
  category: ObjectId;
  subCategory: ObjectId;
  brand: ObjectId;
  ratingsAverage: number;
  ratingsQuantity: number;
  discount:number;
}
