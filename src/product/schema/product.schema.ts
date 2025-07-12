/* eslint-disable prettier/prettier */
import * as mongoose from 'mongoose';
export const ProductSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'You must put the title'],
      minLength: [3, 'min length of title is 3'],
      unique: true,
    },
    description: {
      type: String,
      required: [true, 'You must put the description'],
      minLength: [20, 'min length of title is 20'],
    },
    quantity: {
      type: Number,
      required: [true, 'You must put the description'],
      min: [1, 'min quantity is 1'],
      max: [500, 'max quantity is 500'],
      default: 1,
    },
    imageCover: {
      type: String,
      required: [true, 'You must put image cover'],
    },
    images: Array,
    sold: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'You must put the price'],
      min: [1, 'min quantity is 1'],
      max: [20000, 'max price is 20000'],
    },
    discount: {
      type: Number,
      max: [20000, 'max Price After Discount is 20000'],
      default: 0,
    },
    priceAfterDicount:{type:Number,default:0},
    color: Array,
    category: {
      type: mongoose.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category field is required'],
    },
    subCategory: {
      type: mongoose.Types.ObjectId,
      ref: 'SubCategory',
    },
    brand: {
      type: mongoose.Types.ObjectId,
      ref: 'Brand',
    },
    ratingsAverage: {
      type: Number,
      default: 0,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
); 
ProductSchema.pre('save', function (next) {
  this.priceAfterDicount =this.price - (this.price * this.discount) / 100;
  next();
});;