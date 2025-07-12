/* eslint-disable prettier/prettier */
import { Connection } from 'mongoose';
import { UserSchema } from './user.schema';

export const usersProviders = [
  {
    provide: 'USERS_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('User', UserSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
