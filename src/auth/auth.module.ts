/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { usersProviders } from 'src/user/schema/user.provider';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  controllers: [AuthController],
  imports: [DatabaseModule],
  providers: [AuthService, ...usersProviders],
})
export class AuthModule {}
