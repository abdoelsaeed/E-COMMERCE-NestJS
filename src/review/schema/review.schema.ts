/* eslint-disable prettier/prettier */
import * as mongoose from 'mongoose';
export const ReviewSchema = new mongoose.Schema(
  {
    reviewText: {
      type: String,
      minLength: 3,
      unique: true,
    },
    rating: {
      type: Number,
      min: [1, 'the min rating is 1'],
      max: [5, 'the max rating is 5'],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'You must put the user id'],
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'You must put the product id'],
    },
  },
  {
    timestamps: true,
  },
); 
