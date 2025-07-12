/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserForController, UserMeController } from './user.controller';
import { usersProviders } from './schema/user.provider';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [UserForController, UserMeController],
  providers: [UserService, ...usersProviders],
  exports: [UserService],
})
export class UserModule {}
