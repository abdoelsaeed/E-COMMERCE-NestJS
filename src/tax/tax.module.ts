/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TaxService } from './tax.service';
import { TaxController } from './tax.controller';
import { taxProviders } from './schema/tax.provider';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [TaxController],
  providers: [TaxService, ...taxProviders],
  exports: [...taxProviders],
})
export class TaxModule {}
