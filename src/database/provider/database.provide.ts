/* eslint-disable prettier/prettier */
import * as mongoose from 'mongoose';

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: async (): Promise<typeof mongoose> => {
      const mongoUri =
        process.env.DATABASE_URL ||
        'mongodb+srv://abdoelsaeed2:12345@cluster000.h7jdjme.mongodb.net/e-commerceNestJs?retryWrites=true&w=majority&appName=Cluster000';
      return mongoose.connect(mongoUri);
    },
  },
];
