/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-base-to-string */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */

import { HttpException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import mongoose, { Model } from 'mongoose';
import { handleCastError } from 'src/error/handleCastErrorID';
import { Review } from './interfaces/review.interface';
import { Product } from 'src/product/interfaces/product.interface';

@Injectable()
export class ReviewService {
  constructor(
    @Inject('REVIEW_MODEL') private reviewModel: Model<Review>,
    @Inject('PRODUCT_MODEL') private productModel: Model<Product>,
  ) {}
  async clacReview(productId: string) {
    const reviews = await this.reviewModel.aggregate([
      {
        $match: {
          product: new mongoose.Types.ObjectId(productId),
        },
      },
      {
        $group: {
          _id: '$product',
          totalRating: { $sum: '$rating' },
          averageRating: { $avg: '$rating' },
        },
      },
    ]);
    return reviews;
  }
  async create(createReviewDto: CreateReviewDto, req: any) {
    try {
      const userId = req.user._id;
      const product = await this.productModel.findById(createReviewDto.product);
      if (!product) throw new HttpException(`This id product is invalid`, 400);
      const checkreview = await this.reviewModel.findOne({
        user: userId,
        product: createReviewDto.product,
      });
      if (checkreview)
        throw new HttpException(
          `You can't do review on product more than one`,
          400,
        );

      const review = await this.reviewModel.create({
        ...createReviewDto,
        user: userId,
      });
      const reviews = await this.clacReview(createReviewDto.product);

      product.ratingsAverage = Math.round(reviews[0].averageRating);
      product.ratingsQuantity = reviews[0].totalRating;
      await product.save({ validateBeforeSave: false });
      return {
        status: 200,
        data: review,
      };
    } catch (err) {
      return err;
    }
  }

  async findAll(productId) {
    const review = await this.reviewModel
      .find({ product: productId })
      .populate({ path: 'product user', select: 'name  title ' });
    if (!review) {
      throw new HttpException(`no product with this ID`, 400);
    }
    return {
      status: 200,
      length: review.length,
      data: review,
    };
  }

  async findOne(id: string) {
    const review = await this.reviewModel.find({ user: id }).select('-__v');

    if (!review) {
      throw new HttpException(`No review with this id [${id}]`, 400);
    }
    return {
      status: 200,
      data: review,
    };
  }

  async update(id: string, updateReviewDto: UpdateReviewDto, req) {
    try {
      const review = await this.reviewModel.findById(id);
      if (!review) {
        throw new HttpException(`No review with this id [${id}]`, 400);
      }
      const product = await this.productModel.findById(review.product);
      if (!product) throw new HttpException(`This id product is invalid`, 400);
      if (req.user._id.toString() !== review.user.toString()) {
        throw new UnauthorizedException(
          'You are not the owner to this review😂',
        );
      }
      await review.updateOne(updateReviewDto);
      const reviews = await this.clacReview(review.product);

      product.ratingsAverage = Math.round(reviews[0].averageRating);
      product.ratingsQuantity = reviews[0].totalRating;
      await product.save({ validateBeforeSave: false });
      return {
        status: 200,
        data: 'review Updated Successfuly',
      };
    } catch (err) {
      if (err.name === 'CastError') {
        return handleCastError(err);
      }
      throw err;
    }
  }

  async remove(id: string, req: any) {
    const review = await this.reviewModel.findById(id);
    if (!review) {
      throw new HttpException(
        {
          status: 400,
          error: `No review with this id [${id}]`,
        },
        400,
      );
    }
    const product = await this.productModel.findById(review.product);
    if (!product)
    throw new HttpException(`This id product is invalid`, 400);

    if (req.user._id.toString() !== review.user.toString()) {
      throw new UnauthorizedException('You are not the owner to this review😂');
    }
    await review.deleteOne();
          const reviews = await this.clacReview(review.product);

    product.ratingsAverage = Math.round(reviews[0].averageRating);
    product.ratingsQuantity = reviews[0].totalRating;
    await product.save({ validateBeforeSave: false });
  }
}
