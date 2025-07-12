/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { SupplierService } from './suppliers.service';
import { SupplierController } from './suppliers.controller';
import { supplierProviders } from './schema/suppliers.provider';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [SupplierController],
  providers: [SupplierService, ...supplierProviders],
})
export class SupplierModule {}
