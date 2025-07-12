/* eslint-disable prettier/prettier */
import * as mongoose from 'mongoose';
export const TaxSchema = new mongoose.Schema(
  {
    texPrice: {
      type:Number,
      default:0
    },
    shippingPrice: Number,
  },
  {
    timestamps: true,
  },
); 