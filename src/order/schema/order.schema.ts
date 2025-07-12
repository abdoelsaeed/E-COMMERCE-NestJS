/* eslint-disable prettier/prettier */
import * as mongoose from 'mongoose';
export const OrderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: [true, 'You must put the user id'],
    },
    cartItems: {
      type: [
        {
          product: {
            type: mongoose.Types.ObjectId,
            ref: 'Product',
          },
          quantity: {
            type: Number,
            required: true,
          },
          color: {
            type: String,
          },
          price: {
            type: Number,
            required: true,
          },
        },
      ],
      required: [true, 'You missing adding cart'],
    },
    sessionId:String,
    taxPrice: {
      type: Number,
      default: 0,
    },
    shippingPrice: {
      type: Number,
      default: 0,
    },
    totalOrderPrice: {
      type: Number,
      required: [true, 'You must put Total price'],
    },
    paymentMethodType: {
      type: String,
      enum: ['cash', 'card'],
      required: [true, 'You must put payment type '],
      default:'card'
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    paidAt: {
      type: Date,
    },
    delieverdAt: {
      type: Date,
    },
    isDelieverd: {
      type: Boolean,
      default: false,
    },
    shippingAddress: {
      alias: String,
      details: String,
      phone: String,
      city: String,
      postalCode: String,
    },
  },
  {
    timestamps: true,
  },
); 