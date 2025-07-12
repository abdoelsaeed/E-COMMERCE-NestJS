/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpException } from '@nestjs/common';
import { CouponService } from './coupon.service';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { AuthGuard } from 'src/guard/Auth.guard';
import { Roles } from 'src/guard/user.decorator';
import { ApiTags, ApiOperation, ApiParam, ApiBearerAuth, ApiBody, ApiResponse } from '@nestjs/swagger';

@ApiTags('Coupon')
@ApiBearerAuth()
@Controller('coupon')
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  @UseGuards(AuthGuard)
  @Roles(['Admin'])
  @Post()
  @ApiOperation({ summary: 'Create coupon', description: 'إضافة كوبون جديد (للمدير فقط).' })
  @ApiBody({ type: CreateCouponDto })
  @ApiResponse({ status: 201, description: 'تم إنشاء الكوبون بنجاح.' })
  create(@Body() createCouponDto: CreateCouponDto) {
    const isExpired = new Date(createCouponDto.expireDate) <= new Date();
    if(isExpired) {
      throw new HttpException('Invalid coupon', 404);
    }
    return this.couponService.create(createCouponDto);
  }
  @UseGuards(AuthGuard)
  @Roles(['Admin'])
  @Get()
  @ApiOperation({ summary: 'Get all coupons', description: 'جلب جميع الكوبونات (للمدير فقط).' })
  @ApiResponse({ status: 200, description: 'تم جلب الكوبونات.' })
  findAll() {
    return this.couponService.findAll();
  }
  @UseGuards(AuthGuard)
  @Roles(['Admin'])
  @Get(':id')
  @ApiOperation({ summary: 'Get coupon by id', description: 'جلب كوبون بواسطة المعرف (للمدير فقط).' })
  @ApiParam({ name: 'id', description: 'معرف الكوبون (MongoId)' })
  @ApiResponse({ status: 200, description: 'تم جلب الكوبون.' })
  findOne(@Param('id') id: string) {
    return this.couponService.findOne(id);
  }
  @UseGuards(AuthGuard)
  @Roles(['Admin'])
  @Patch(':id')
  @ApiOperation({ summary: 'Update coupon', description: 'تحديث بيانات كوبون (للمدير فقط).' })
  @ApiParam({ name: 'id', description: 'معرف الكوبون (MongoId)' })
  @ApiBody({ type: UpdateCouponDto })
  @ApiResponse({ status: 200, description: 'تم تحديث الكوبون.' })
  update(@Param('id') id: string, @Body() updateCouponDto: UpdateCouponDto) {
    if(updateCouponDto.expireDate) {
        const IsExpired = new Date(updateCouponDto.expireDate) <= new Date();
        if (IsExpired) {
          throw new HttpException('Invalid coupon', 404);
        }
      }
    return this.couponService.update(id, updateCouponDto);
  }
  @UseGuards(AuthGuard)
  @Roles(['Admin'])
  @Delete(':id')
  @ApiOperation({ summary: 'Delete coupon', description: 'حذف كوبون (للمدير فقط).' })
  @ApiParam({ name: 'id', description: 'معرف الكوبون (MongoId)' })
  @ApiResponse({ status: 200, description: 'تم حذف الكوبون.' })
  remove(@Param('id') id: string) {
    return this.couponService.remove(id);
  }
}
