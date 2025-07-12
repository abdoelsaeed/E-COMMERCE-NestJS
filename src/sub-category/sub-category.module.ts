/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { SubCategoryService } from './sub-category.service';
import { SubCategoryController } from './sub-category.controller';
import { DatabaseModule } from 'src/database/database.module';
import { subCategoryProviders } from './schema/subCategory.provide';
import { CategoryModule } from 'src/category/category.module';

@Module({
  imports: [DatabaseModule, CategoryModule],
  controllers: [SubCategoryController],
  providers: [SubCategoryService, ...subCategoryProviders],
  exports:[...subCategoryProviders]
})
export class SubCategoryModule {}
