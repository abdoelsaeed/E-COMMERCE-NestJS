/* eslint-disable prettier/prettier */
import { Connection } from 'mongoose';
import { SubCategorySchema } from './subCategory.schema';

export const subCategoryProviders = [
  {
    provide: 'SubCATEGORY_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('SubCategory', SubCategorySchema),
    inject: ['DATABASE_CONNECTION'], // تأكد من أن DATABASE_CONNECTION مسجل
  },
];