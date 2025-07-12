/* eslint-disable prettier/prettier */
import { Connection } from 'mongoose';
import { OrderSchema } from './order.schema';

export const orderProviders = [
  {
    provide: 'ORDER_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('Order', OrderSchema),
    inject: ['DATABASE_CONNECTION'], // تأكد من أن DATABASE_CONNECTION مسجل
  },
];