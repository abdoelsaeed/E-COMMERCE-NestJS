/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { DatabaseModule } from 'src/database/database.module';
import { reviewProviders } from './schema/review.provide';
import { UserModule } from 'src/user/user.module';
import { ProductModule } from 'src/product/product.module';

@Module({
  imports: [DatabaseModule, UserModule, ProductModule],
  controllers: [ReviewController],
  providers: [ReviewService, ...reviewProviders],
  exports: [...reviewProviders],
})
export class ReviewModule {}
