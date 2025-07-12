/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { HttpException, Inject, Injectable } from '@nestjs/common';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { Model } from 'mongoose';
import { Coupon } from './interfaces/coupon.interface';
import { handleMongoError } from 'src/error/handleMongoError';

@Injectable()
export class CouponService {
  constructor(@Inject('COUPON_MODEL') private couponModel: Model<Coupon>) {}
  async create(createCouponDto: CreateCouponDto) {
    try {
      const Coupon = await this.couponModel.create(createCouponDto);
      return {
        data: Coupon,
      };
    } catch (err) {
      if (err.code === 11000) return handleMongoError(err);
      return err;
    }
  }

  async findAll() {
    const Coupon = await this.couponModel.find();
    return {
      status: 200,
      length: Coupon.length,
      data: Coupon,
    };
  }

  async findOne(id: string) {
    try {
      const Coupon = await this.couponModel.findById(id);
      if (!Coupon) {
        throw new HttpException(
          {
            status: 400,
            error: `No Coupon with this id [${id}]`,
          },
          400,
        );
      }
      return {
        status: 200,
        data: Coupon,
      };
    } catch (err) {
      return err;
    }
  }

  async update(id: string, updateCouponDto: UpdateCouponDto) {
    try {
      const Coupon = await this.couponModel
        .findByIdAndUpdate(id, updateCouponDto, { new: true })
        .select('-__v');
      if (!Coupon) {
        throw new HttpException(
          {
            status: 400,
            error: `No Coupon with this id [${id}]`,
          },
          400,
        );
      }
      return {
        status: 200,
        message: 'update successfuly',
        data: Coupon,
      };
    } catch (err) {
      return err;
    }
  }

  async remove(id: string) {
    const Coupon = await this.couponModel.findByIdAndDelete(id);
    if (!Coupon) {
      throw new HttpException(
        {
          status: 400,
          error: `No Coupon with this id [${id}]`,
        },
        400,
      );
    }
    return {
      status: 201,
      message: 'Done!',
    };
  }
  catch(err: any) {
    return err;
  }
}
