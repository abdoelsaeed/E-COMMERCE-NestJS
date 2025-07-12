/* eslint-disable prettier/prettier */
import { Document } from 'mongoose';
export interface RequestProduct extends Document {
  titleNeed: string;
  details: string;
  qauntity: number;
  category:string;
  user:any;
}
