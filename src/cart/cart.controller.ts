/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpException, Req } from '@nestjs/common';
import { CartService } from './cart.service';
import { UpdateCartDto } from './dto/update-cart.dto';
import { AuthGuard } from 'src/guard/Auth.guard';
import { Roles } from 'src/guard/user.decorator';
import { isValidObjectId } from 'mongoose';
import { ApiTags, ApiOperation, ApiParam, ApiBearerAuth, ApiBody, ApiResponse } from '@nestjs/swagger';

@ApiTags('Cart')
@ApiBearerAuth()
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}
  @UseGuards(AuthGuard)
  @Roles(['User'])
  @Post(':productId')
  @ApiOperation({
    summary: 'Add product to cart',
    description: 'يضيف منتج إلى عربة المستخدم الحالي.',
  })
  @ApiParam({ name: 'productId', description: 'معرف المنتج (MongoId)' })
  @ApiResponse({ status: 200, description: 'تم إضافة المنتج بنجاح.' })
  create(@Param('productId') productId: string, @Req() req: any) {
    if (!isValidObjectId(productId)) {
      throw new HttpException('productId is not mongoId', 400);
    }
    return this.cartService.create(productId, req);
  }
  @UseGuards(AuthGuard)
  @Roles(['Admin'])
  @Get()
  @ApiOperation({
    summary: 'Get all carts (Admin)',
    description: 'يعرض جميع العربات (للمدير فقط).',
  })
  @ApiResponse({ status: 200, description: 'تم جلب جميع العربات.' })
  findAll() {
    return this.cartService.findAll();
  } 

  @UseGuards(AuthGuard)
  @Roles(['User'])
  @Post('/coupon/:couponName')
  @ApiOperation({
    summary: 'Apply coupon to cart',
    description:
      'تطبيق كوبون خصم على عربة المستخدم. يقوم بحساب السعر بعد الخصم ويضيف الكوبون إلى العربة.',
  })
  @ApiParam({ name: 'couponName', description: 'اسم الكوبون المراد تطبيقه' })
  @ApiResponse({
    status: 200,
    description: 'تم تطبيق الكوبون بنجاح.',
    schema: {
      example: {
        status: 200,
        message: 'Coupon applied successfully',
        data: {
          _id: '6646e7c2b1e2c2a1b2c3d4e5',
          cartItem: [
            /* ... */
          ],
          totalPrice: 1000,
          totalPriceAfterDiscount: 800,
          coupons: [
            { name: 'SUMMER2024', couponId: '6646e7c2b1e2c2a1b2c3d4e5' },
          ],
          user: '6646e7c2b1e2c2a1b2c3d4e1',
          // ... باقي بيانات العربة
        },
      },
    },
  })
  applyCoupon(@Req() req: any, @Param('couponName') couponName: string) {
    return this.cartService.applyCoupon(req, couponName);
  }

  @UseGuards(AuthGuard)
  @Roles(['User', 'Admin'])
  @Get('mycart')
  @ApiOperation({
    summary: 'Get my cart',
    description: 'يعرض عربة المستخدم الحالي.',
  })
  @ApiResponse({ status: 200, description: 'تم جلب عربة المستخدم.' })
  findOne(@Req() req: any) {
    return this.cartService.findOne(req);
  }

  @UseGuards(AuthGuard)
  @Roles(['User'])
  @Patch(':id')
  @ApiOperation({
    summary: 'Update cart item',
    description: 'تحديث كمية أو لون منتج في العربة.',
  })
  @ApiParam({ name: 'id', description: 'معرف المنتج في العربة (MongoId)' })
  @ApiBody({ type: UpdateCartDto })
  @ApiResponse({ status: 200, description: 'تم تحديث العربة بنجاح.' })
  update(
    @Param('id') id: string,
    @Body() updateCartDto: UpdateCartDto,
    @Req() req: any,
  ) {
    return this.cartService.update(id, updateCartDto, req);
  }

  @UseGuards(AuthGuard)
  @Roles(['User'])
  @Delete(':id')
  @ApiOperation({
    summary: 'Remove product from cart',
    description: 'حذف منتج من عربة المستخدم.',
  })
  @ApiParam({ name: 'id', description: 'معرف المنتج في العربة (MongoId)' })
  @ApiResponse({ status: 200, description: 'تم حذف المنتج من العربة.' })
  remove(@Param('id') id: string, @Req() req: any) {
    return this.cartService.remove(id, req);
  }

  @UseGuards(AuthGuard)
  @Roles(['Admin'])
  @Get('/admin/:id')
  findCart(@Param('id') id: string) {
    return this.cartService.findCart(id);
  }


}
