/* eslint-disable prettier/prettier */
import { Document, ObjectId } from 'mongoose';
export interface Review extends Document {
  reviewText: string;
  rating: number;
  product:string;
  user:ObjectId;
}
