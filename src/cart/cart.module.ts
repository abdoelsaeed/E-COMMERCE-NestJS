/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { DatabaseModule } from 'src/database/database.module';
import { cartProviders } from './schema/cart.provider';
import { ProductModule } from 'src/product/product.module';
import { CouponModule } from 'src/coupon/coupon.module';

@Module({
  imports: [DatabaseModule, ProductModule, CouponModule],
  controllers: [CartController],
  providers: [CartService, ...cartProviders],
  exports: [...cartProviders],
})
export class CartModule {}
