/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { CouponService } from './coupon.service';
import { CouponController } from './coupon.controller';
import { couponProviders } from './schema/coupon.provider';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [CouponController],
  providers: [CouponService, ...couponProviders],
  exports: [...couponProviders],
})
export class CouponModule {}
