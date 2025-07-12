/* eslint-disable prettier/prettier */
import { Connection } from 'mongoose';
import { CartSchema } from './cart.schema';

export const cartProviders = [
  {
    provide: 'CART_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('Cart', CartSchema),
    inject: ['DATABASE_CONNECTION'], // تأكد من أن DATABASE_CONNECTION مسجل
  },
];