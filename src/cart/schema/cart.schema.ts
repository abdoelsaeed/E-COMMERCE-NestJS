/* eslint-disable prettier/prettier */
import * as mongoose from 'mongoose';
export const CartSchema = new mongoose.Schema(
  {
    cartItem: [
      {
        productId:{
          type: mongoose.Types.ObjectId,
          ref: 'Product',
          require: [true, 'You must put the productsId'],
        },
        quantity:{
          type:Number,
          default:1
        },
        color:{
          type:String,
          default:''
        },
    },
    ],
    totalPrice: {
      type: Number,
      require: [true, 'You must put the total price'],
    },
    totalPriceAfterDiscount: {
      type: Number,
      require: [true, 'You must put the total price After Discount'],
    },
    coupons: [
      {
        name: String,
        couponId: {
          type: mongoose.Types.ObjectId,
          ref: 'Coupon',
        },
      },
    ],
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      require: [true, 'You must put the userId'],
    },
  },
  {
    timestamps: true,
  },
); 