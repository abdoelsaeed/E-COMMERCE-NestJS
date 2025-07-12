/* eslint-disable prettier/prettier */

import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, HttpException } from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { AuthGuard } from 'src/guard/Auth.guard';
import { Roles } from 'src/guard/user.decorator';
import { isValidObjectId } from 'mongoose';
import { ApiTags, ApiOperation, ApiParam, ApiBearerAuth, ApiBody, ApiResponse } from '@nestjs/swagger';

@ApiTags('Review')
@ApiBearerAuth()
@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @UseGuards(AuthGuard)
  @Roles(['User'])
  @Post()
  @ApiOperation({ summary: 'Create review', description: 'إضافة تقييم جديد للمنتج (للمستخدم).' })
  @ApiBody({ type: CreateReviewDto })
  @ApiResponse({ status: 201, description: 'تم إضافة التقييم بنجاح.' })
  create(@Body() createReviewDto: CreateReviewDto, @Req() req: any) {
    return this.reviewService.create(createReviewDto, req);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get all reviews for product', description: 'جلب كل التقييمات لمنتج معين.' })
  @ApiParam({ name: 'id', description: 'معرف المنتج (MongoId)' })
  @ApiResponse({ status: 200, description: 'تم جلب التقييمات.' })
  findAll(@Param('id') productId) {
    if (!isValidObjectId(productId)) {
      throw new HttpException('productId is not mongoId', 400);
    }
    return this.reviewService.findAll(productId);
  }

  @UseGuards(AuthGuard)
  @Roles(['Admin'])
  @Get('user/:id')
  @ApiOperation({ summary: 'Get review by id', description: 'جلب تقييم بواسطة المعرف (للمدير فقط).' })
  @ApiParam({ name: 'id', description: 'معرف التقييم (MongoId)' })
  @ApiResponse({ status: 200, description: 'تم جلب التقييم.' })
  findOne(@Param('id') id: string) {
    if (!isValidObjectId(id)) {
      throw new HttpException('productId is not mongoId', 400);
    }
    return this.reviewService.findOne(id);
  }
  @UseGuards(AuthGuard)
  @Roles(['User'])
  @Patch(':id')
  @ApiOperation({ summary: 'Update review', description: 'تحديث تقييم (للمستخدم).' })
  @ApiParam({ name: 'id', description: 'معرف التقييم (MongoId)' })
  @ApiBody({ type: UpdateReviewDto })
  @ApiResponse({ status: 200, description: 'تم تحديث التقييم.' })
  update(
    @Param('id') id: string,
    @Body() updateReviewDto: UpdateReviewDto,
    @Req() req: any,
  ) {
    // eslint-disable-next-line
    // @ts-ignore
    return this.reviewService.update(id, updateReviewDto, req);
  }

  @UseGuards(AuthGuard)
  @Roles(['User'])
  @Delete(':id')
  @ApiOperation({ summary: 'Delete review', description: 'حذف تقييم (للمستخدم).' })
  @ApiParam({ name: 'id', description: 'معرف التقييم (MongoId)' })
  @ApiResponse({ status: 200, description: 'تم حذف التقييم.' })
  remove(@Param('id') id: string, @Req() req) {
    return this.reviewService.remove(id,req);
  }
}
