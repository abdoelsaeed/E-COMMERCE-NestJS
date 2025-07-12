/* eslint-disable prettier/prettier */
import { Document } from 'mongoose';
export interface Suppliers extends Document {
  name: string;
  website:string;
}
