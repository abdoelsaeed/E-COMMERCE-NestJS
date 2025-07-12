/* eslint-disable prettier/prettier */
import * as mongoose from 'mongoose';
export const SubCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'You must put the category name'],
      minLength: 3,
      maxLength: 30,
      unique: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref:'Category',
      required: [true, 'You must put the category id'],
    },
  },
  {
    timestamps: true,
  },
); 