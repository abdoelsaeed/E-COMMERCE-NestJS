/* eslint-disable prettier/prettier */
import { Document } from 'mongoose';
export interface Brand extends Document {
  name: string;
  image: string;
}
