/* eslint-disable prettier/prettier */
import { Document } from 'mongoose';
export interface SubCategory extends Document {
  name: string;
  image: string;
}
