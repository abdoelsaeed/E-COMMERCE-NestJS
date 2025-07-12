/* eslint-disable prettier/prettier */
import {
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  NotFoundException,
  Req,
  Headers,
  Query,
  RawBodyRequest,
  Controller,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { AuthGuard } from 'src/guard/Auth.guard';
import { Roles } from 'src/guard/user.decorator';
import { Request } from 'express';
import { ApiTags, ApiOperation, ApiParam, ApiBearerAuth, ApiBody, ApiResponse, ApiQuery } from '@nestjs/swagger';

@ApiTags('Order')
@ApiBearerAuth()
@Controller('cart/checkout')
export class OrderCheckoutController {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(AuthGuard)
  @Roles(['User'])
  @Post(':paymentMethodType')
  @ApiOperation({ summary: 'Create order', description: 'إنشاء طلب جديد (كاش أو كارد). يتطلب بيانات الطلب وطريقة الدفع.' })
  @ApiParam({ name: 'paymentMethodType', description: 'نوع الدفع (cash أو card)' })
  @ApiBody({ type: CreateOrderDto })
  @ApiResponse({ status: 200, description: 'تم إنشاء الطلب بنجاح.' })
  @ApiResponse({ status: 404, description: 'بيانات غير مكتملة أو خطأ في طريقة الدفع.' })
  create(
    @Body() createOrderDto: CreateOrderDto,
    @Param('paymentMethodType') paymentMethodType: 'card' | 'cash',
    @Req() req: any,
    @Query() query,
  ) {
    if (!['cash', 'card'].includes(paymentMethodType)) {
      throw new NotFoundException('Invalid payment method type');
    }
    return this.orderService.create(
      createOrderDto,
      paymentMethodType ,
      req,
      query,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get all orders', description: 'جلب جميع الطلبات.' })
  @ApiResponse({ status: 200, description: 'تم جلب الطلبات.' })
  findAll() {
    return this.orderService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get order by id', description: 'جلب طلب بواسطة المعرف.' })
  @ApiParam({ name: 'id', description: 'معرف الطلب (MongoId)' })
  @ApiResponse({ status: 200, description: 'تم جلب الطلب.' })
  @ApiResponse({ status: 400, description: 'لا يوجد طلب بهذا المعرف.' })
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Roles(['Admin'])
  @Patch(':id')
  @ApiOperation({ summary: 'Update order (cash paid)', description: 'تحديث حالة الدفع والتوصيل لطلب مدفوع كاش (للمدير فقط).' })
  @ApiParam({ name: 'id', description: 'معرف الطلب (MongoId)' })
  @ApiBody({ type: UpdateOrderDto })
  @ApiResponse({ status: 200, description: 'تم تحديث الطلب.' })
  @ApiResponse({ status: 400, description: 'خطأ في تحديث الطلب.' })
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.updatePaidCash(id, updateOrderDto);
  }

  @UseGuards(AuthGuard)
  @Roles(['Admin'])
  @Delete(':id')
  @ApiOperation({ summary: 'Delete order', description: 'حذف طلب (للمدير فقط).' })
  @ApiParam({ name: 'id', description: 'معرف الطلب (MongoId)' })
  @ApiResponse({ status: 201, description: 'تم حذف الطلب.' })
  @ApiResponse({ status: 400, description: 'لا يوجد طلب بهذا المعرف.' })
  remove(@Param('id') id: string) {
    return this.orderService.remove(id);
  }
}

@ApiTags('CheckoutCard')
@Controller('checkout/session')
export class CheckoutCardController {
  constructor(private readonly orderService: OrderService) {}

  // webhook paid order true auto
  // access for Stripe Only
  @Post()
  @ApiOperation({ summary: 'Stripe Webhook: Update paid card order', description: 'تحديث حالة الطلب المدفوع بالكارت تلقائيًا (يستخدم من Stripe فقط).' })
  @ApiResponse({ status: 200, description: 'تم تحديث حالة الطلب بنجاح.' })
  updatePaidCard(@Headers('stripe-signature') sig, @Req() request: RawBodyRequest<Request>,) {
    const endpointSecret ='whsec_f94d202a1b3cfe749e62f892d505c820062f7d4b9a5c6514e0864ad294448972';
    const payload = request.rawBody;

    // parseing body=> express.raw({type:'application/json'})
    return this.orderService.updatePaidCard(payload, sig, endpointSecret);  }
}
//دي بتاعت stripe localhost
//stripe login

//stripe listen --forward-to localhost:3000/api/v1/checkout/session

//stripe trigger payment_intent.succeeded

@Controller('/order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}
  @UseGuards(AuthGuard)
  @Roles(['User'])
  @Get('/me')
  findMyOrder(@Req() req) {
    return this.orderService.findMyOrder(req);
  }

  @UseGuards(AuthGuard)
  @Roles(['Admin'])
  @Get()
  @ApiOperation({ summary: 'Get all orders (with filter, pagination, sort)', description: 'جلب جميع الطلبات مع دعم الفلترة، الترتيب، والتقسيم للصفحات (pagination).' })
  @ApiResponse({ status: 200, description: 'تم جلب الطلبات مع الفلترة والتقسيم.' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'رقم الصفحة (افتراضي 1)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'عدد النتائج في الصفحة (افتراضي 10)' })
  @ApiQuery({ name: 'sort', required: false, type: String, description: 'ترتيب النتائج (مثال: -createdAt للأحدث أولاً)' })
  @ApiQuery({ name: 'user', required: false, type: String, description: 'فلترة حسب المستخدم (user id)' })
  @ApiQuery({ name: 'isPaid', required: false, type: Boolean, description: 'فلترة حسب حالة الدفع' })
  @ApiQuery({ name: 'isDelieverd', required: false, type: Boolean, description: 'فلترة حسب حالة التوصيل' })
  findAllOrders(@Query() query) {
    return this.orderService.findAllOrders(query);
  }

  @UseGuards(AuthGuard)
  @Roles(['Admin'])
  @Get('/user/:id')
  findAllOrdersByUserId(@Param('id') userId) {
    return this.orderService.findAllOrdersByUserId(userId);
  }
}


