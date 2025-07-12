/* eslint-disable prettier/prettier */
import { Connection } from 'mongoose';
import { SupplierSchema } from './suppliers.schema';

export const supplierProviders = [
  {
    provide: 'SUPPLIER_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('Supplier', SupplierSchema),
    inject: ['DATABASE_CONNECTION'], // تأكد من أن DATABASE_CONNECTION مسجل
  },
];