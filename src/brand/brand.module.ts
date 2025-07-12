/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { BrandService } from './brand.service';
import { BrandController } from './brand.controller';
import { brandProviders } from './schema/brand.provider';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports:[DatabaseModule],
  controllers: [BrandController],
  providers: [BrandService, ...brandProviders],
  exports:[...brandProviders]
})
export class BrandModule {}
