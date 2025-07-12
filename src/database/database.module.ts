/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { databaseProviders } from './provider/database.provide';

@Module({
  providers: [...databaseProviders],
  exports: [...databaseProviders],
})
//عشان من غيرها اي موديل مش هيقدر اي حد\ يستخدم الكونكشنexportsعملنا
export class DatabaseModule {}
