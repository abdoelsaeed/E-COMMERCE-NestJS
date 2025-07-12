/* eslint-disable prettier/prettier */
import { Connection } from 'mongoose';
import { TaxSchema } from './tax.schema';

export const taxProviders = [
  {
    provide: 'TAX_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('Tax', TaxSchema),
    inject: ['DATABASE_CONNECTION'], // تأكد من أن DATABASE_CONNECTION مسجل
  },
];