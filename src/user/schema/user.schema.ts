/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';

export const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'name is required'],
      trim: true,
      minlength: [3, 'min length is 3'],
      maxlength: [30, 'max length is 30'],
    },
    password: {
      type: String,
      minlength: [3, 'min length is 3'],
      maxlength: [30, 'max length is 30'],
      required: [true, 'password is required'],
      select: false,
    },
    email: {
      type: String,
      minlength: [3, 'min length is 30'],
      maxlength: [30, 'max length is 30'],
      required: [true, 'email is required'],
      unique: true,
    },
    role: {
      type: String,
      enum: ['Admin', 'User'],
    },
    avatar: {
      type: String,
    },
    age: {
      type: Number,
    },
    phone_number: {
      type: String,
    },
    address: String,
    active: {
      type: Boolean,
      default: true,
    },
    gender: {
      type: String,
      enum: ['male', 'female'],
    },
    verification_Code: { type: String, select: false },
    codeExpiresAt: { type: Date, select: false }
  },
  { timestamps: true },
);
UserSchema.pre('save', async function (next) {
  const user = this as any; // تعريف المستخدم الحالي
  if (!user.isModified('password')) {
    return next(); 
  }
  const salt = await bcrypt.genSalt(10); // إنشاء salt
  user.password = await bcrypt.hash(user.password, salt); // عمل hash لكلمة المرور
  next();
});
UserSchema.pre(/^find/, function (next) {
  const user = this as any;
  user.find({ active: true }); 
  next();
});
