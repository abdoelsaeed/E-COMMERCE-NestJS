/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { requestProductService } from './requestProduct.service';
import { RequestProductController } from './requestProduct.controller';
import { requestProductProviders } from './schema/requestProduct.provider';
import { DatabaseModule } from 'src/database/database.module';
import { usersProviders } from 'src/user/schema/user.provider';

@Module({
  imports: [DatabaseModule],
  controllers: [RequestProductController],
  providers: [requestProductService, ...requestProductProviders,...usersProviders],
  exports: [...requestProductProviders],
})
export class RequestProductModule {}
