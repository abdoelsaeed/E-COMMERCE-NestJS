/* eslint-disable prettier/prettier */
import * as mongoose from 'mongoose';
export const BrandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'You must put the brand name'],
      minLength: 3,
      maxLength: 30,
      unique: true,
    },
    image: String,
  },
  {
    timestamps: true,
  },
); 