/* eslint-disable prettier/prettier */
import * as mongoose from 'mongoose';
export const RequestProductSchema = new mongoose.Schema(
  {
    titleNeed: {
      type: String,
      required: [true, 'You must put the titleNeed '],
    },
    details: {
      type: String,
      required: [true, 'You must put the details '],
      minLength: [5, 'minimin details length is 5'],
    },
    qauntity: {
      type: Number,
      required: [true, 'You must put the qauntity'],
      min: [1, 'minimin qauntity is 1'],
    },
    Category: String,
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: [true, 'You must put the user id'],
    },
  },
  {
    timestamps: true,
  },
); 
