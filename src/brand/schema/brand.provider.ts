/* eslint-disable prettier/prettier */
import { Connection } from 'mongoose';
import { BrandSchema } from './brand.schema';

export const brandProviders = [
  {
    provide: 'BRAND_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('Brand', BrandSchema),
    inject: ['DATABASE_CONNECTION'], // تأكد من أن DATABASE_CONNECTION مسجل
  },
];