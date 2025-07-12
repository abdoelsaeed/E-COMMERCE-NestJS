/* eslint-disable prettier/prettier */
import { Connection } from 'mongoose';
import { CouponSchema } from './coupon.schema';

export const couponProviders = [
  {
    provide: 'COUPON_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('Coupon', CouponSchema),
    inject: ['DATABASE_CONNECTION'], // تأكد من أن DATABASE_CONNECTION مسجل
  },
];