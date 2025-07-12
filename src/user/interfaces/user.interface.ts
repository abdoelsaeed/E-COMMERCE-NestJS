/* eslint-disable prettier/prettier */
import { Document } from 'mongoose';
export interface Users extends Document {
  name: string;
  age: number;
  password: string;
  email: string;
  role: string;
  verification_Code?: string; // إضافة الحقل
  codeExpiresAt?: Date; // إضافة الحقل
}
