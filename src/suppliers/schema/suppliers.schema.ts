/* eslint-disable prettier/prettier */
import * as mongoose from 'mongoose';
export const SupplierSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'You must put the supplier name'],
    },
    website: {
      type: String,
      required: [true, 'You must put the website'],
    },
  },
  {
    timestamps: true,
  },
); 