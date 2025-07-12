/* eslint-disable prettier/prettier */
import { Connection } from 'mongoose';
import { RequestProductSchema } from './requestProduct.schema';

export const requestProductProviders = [
  {
    provide: 'REQUESTPRODUCT_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('RequestProduct', RequestProductSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
