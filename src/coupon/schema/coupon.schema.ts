/* eslint-disable prettier/prettier */
import * as mongoose from 'mongoose';
export const CouponSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'You must put the coupon name'],
      unique: true,
    },
    expireDate: {
      type: Date,
      required: [true, 'You must put the discount'],
    },
    discount: {
      type: Number,
      required: [true, 'You must put the discount'],
      min: [0, 'the discount must be bigger than 0'],
    },
  },
  {
    timestamps: true,
  },
); 