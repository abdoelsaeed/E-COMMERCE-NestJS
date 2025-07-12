/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { productProviders } from './schema/product.provider';
import { DatabaseModule } from 'src/database/database.module';
import { CategoryModule } from 'src/category/category.module';
import { SubCategoryModule } from 'src/sub-category/sub-category.module';
import { BrandModule } from 'src/brand/brand.module';

@Module({
  imports: [DatabaseModule, CategoryModule, SubCategoryModule, BrandModule],
  controllers: [ProductController],
  providers: [ProductService, ...productProviders],
  exports: [...productProviders],
})
export class ProductModule {}
