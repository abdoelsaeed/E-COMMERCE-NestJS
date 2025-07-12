/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable no-case-declarations */
/* eslint-disable @typescript-eslint/no-base-to-string */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { HttpException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Model } from 'mongoose';
import { Order } from './interfaces/order.interface';
import { handleMongoError } from 'src/error/handleMongoError';
import { Cart } from 'src/cart/interfaces/cart.interface';
import { Tax } from 'src/tax/interfaces/tax.interface';
import { Product } from 'src/product/interfaces/product.interface';
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);
@Injectable()
export class OrderService {
  constructor(
    @Inject('ORDER_MODEL') private orderModel: Model<Order>,
    @Inject('CART_MODEL') private cartModel: Model<Cart>,
    @Inject('TAX_MODEL') private taxModel: Model<Tax>,
    @Inject('PRODUCT_MODEL') private productModel: Model<Product>,
  ) {}
  async create(
    createOrderDto: CreateOrderDto,
    paymentMethodType: string,
    req: any,
    query,
  ) {
    try {
      const { success_url, cancel_url } = query;
      if (paymentMethodType === 'card'){
        if (!success_url || !cancel_url) {
          throw new NotFoundException('please put success_url and cancel_url');
        }
      }
      const userId = req.user._id;
      const cart = await this.cartModel
      .findOne({ user: userId })
      .populate([{ path: 'cartItem.productId' }, { path: 'user' }]);
      if (!cart) {
        throw new NotFoundException('Cart not found');
      }
      
      const tax = await this.taxModel.findOne({});
      
      if (!tax) {
        throw new NotFoundException('Tax information not found');
      }

      // @ts-ignore
      const shippingAddress = createOrderDto.shippingAddress || cart.user.address || false;
      
      // @ts-ignore
      if (shippingAddress === false) {
        throw new NotFoundException('Shipping address not found');
      }


      const data = {
        user: userId,
        cartItems: cart.cartItem.map((item: any) => ({
          productId: item.productId._id || item.productId, // حسب populate
          quantity: item.quantity,
          color: item.color,
          price:
            item.productId.priceAfterDicount !== 0
              ? item.productId.priceAfterDicount
              : item.productId.price,
        })),
        taxPrice: tax.texPrice,
        shippingPrice: tax.shippingPrice,
        totalOrderPrice: cart.totalPrice + tax.texPrice + tax.shippingPrice,
        paymentMethodType: paymentMethodType,
        shippingAddress,
      };

      //^ if user choose cash
      if (paymentMethodType === 'cash') {
        //insert order in DB and reset the cart
        await this.cartModel.findOneAndUpdate(
          { user: userId },
          { cartItem: [], totalPrice: 0 },
        );
        const order = await this.orderModel.create({
          ...data,
          isPaid: data.totalOrderPrice === 0 ? true : false,
          paidAt: data.totalOrderPrice === 0 ? new Date() : null,
          isDelieverd: false,
        });
        
        if (data.totalOrderPrice === 0) {
          for (const item of cart.cartItem) {
              // @ts-ignore
            await this.productModel.findByIdAndUpdate(item.productId,{$inc: { quantity: -item.quantity },sold: item.quantity},{ new: true }
            );
          }
        }
        return {
          status: 200,
          message: 'Order created successfully',
          data: order,
        };
      }
      //& if user choose card
      const line_items: any[] = cart.cartItem.map(
        ({ productId, color, quantity }): any => {
          // @ts-ignore
          const totalPrice =productId.priceAfterDicount !== 0? productId.priceAfterDicount: productId.price;

          const productData: any = {
              // @ts-ignore
            name: productId.title,
          };
          // @ts-ignore
          if (productId.description) {
            // @ts-ignore
            productData.description = productId.description;
          }
          if (
              // @ts-ignore
            productId.imageCover ||(productId.images && productId.images.length > 0)
          ) {
              // @ts-ignore
            productData.images = [productId.imageCover,...productId.images,
            ].filter(Boolean);
          }
          if (color) {
            productData.metadata = { color };
          }

          return {
            price_data: {
              currency: 'egp',
              unit_amount: Math.round(totalPrice * 100),
              product_data: productData,
            },
            quantity,
          } as any;
        },
      );
      // Add shipping as a separate line item
      line_items.push({
        price_data: {
          currency: 'egp',
          product_data: {
            name: 'Shipping',
            metadata: { color: '' },
          },
          unit_amount: Math.round(tax.shippingPrice * 100),
        },
        quantity: 1,
      } as any);

      // Add tax as a separate line item
      line_items.push({
        price_data: {
          currency: 'egp',
          product_data: {
            name: 'Tax',
            metadata: { color: '' },
          },
          unit_amount: Math.round(tax.texPrice * 100),
        },
        quantity: 1,
      } as any);
      

      const session = await stripe.checkout.sessions.create({
        line_items,
        mode: 'payment',
        success_url: success_url,
        cancel_url: cancel_url,
        // @ts-ignore
        client_reference_id: cart.user._id.toString(),
        // @ts-ignore
        customer_email: cart.user.email,
        metadata: data.shippingAddress,
      });

      const order = await this.orderModel.create({
        ...data,
        sessionId: session.id,
        isPaid: false,
        isDelieverd: false,
      });

      return {
        status: 200,
        message: 'Order created successfully',
        data: {
          url: session.url,
          success_url: session.success_url,
          cancel_url: session.cancel_url,
          expires_at: new Date(session.expires_at * 1000),
          sessionId: session.id,
          totalPrice: session.amount_total,
          data: order
        },
      };
    } catch (err) {
      if (err.code === 11000) return handleMongoError(err);
      return err;
    }
  }

  async findAll() {
    const orders = await this.orderModel.find();
    return {
      status: 200,
      length: orders.length,
      data: orders,
    };
  }

  async findOne(id: string) {
    try {
      const order = await this.orderModel.findById(id);
      if (!order) {
        throw new HttpException(
          {
            status: 400,
            error: `No category with this id [${id}]`,
          },
          400,
        );
      }
      return {
        status: 200,
        data: order,
      };
    } catch (err) {
      return err;
    }
  }

  async updatePaidCash(id: string, updateOrderDto: UpdateOrderDto) {
    try {
      const order = await this.orderModel.findById(id);
      if (!order) {
        throw new HttpException(
          {
            status: 400,
            error: `No category with this id [${id}]`,
          },
          400,
        );
      }
      if(order.paymentMethodType !=='cash'){
        throw new HttpException(
          {
            status: 400,
            error: `this order not paid by cash`,
          },
          400,
        );
      }
      if(order.isPaid){
        throw new HttpException(
          {
            status: 400,
            error: `Order already paid`,
          },
          400,
        );
      }
      if (!updateOrderDto.isPaid){
        throw new HttpException(
          {
            status: 400,
            error: `You must put isPaid`,
          },
          400,
        );
      }

      if (updateOrderDto.isPaid){
        updateOrderDto.paidAt = new Date();
                // @ts-ignore
        const cart = await this.cartModel
          .findOne({ user: order.user.toString()})
          .populate('cartItem.productId user');
          
          //take from stock
          // @ts-ignore
          for (const item of cart.cartItem) {
            // @ts-ignore
            await this.productModel.findByIdAndUpdate(item.productId,{$inc: { quantity: -item.quantity },sold: item.quantity},{ new: true }
            );
          }

          //reset Cart
          await this.cartModel.findOneAndUpdate(
            { user: order.user.toString() },
            { cartItem: [], totalPrice: 0 },
          );
        }

    if (updateOrderDto.isDelieverd) {
      updateOrderDto.deliverdAt = new Date();
    }

    const updatedOrder = await this.orderModel.findByIdAndUpdate(
      id,
      { ...updateOrderDto },
      { new: true },
    );

    return {
      status: 200,
      message: 'Order updated successfully',
      data: updatedOrder,
    };
    }
    catch (err) {
      return err;
    }
  }

  async remove(id: string) {
    const order = await this.orderModel.findByIdAndDelete(id);
    if (!order) {
      throw new HttpException(
        {
          status: 400,
          error: `No category with this id [${id}]`,
        },
        400,
      );
    }
    return {
      status: 201,
      message: 'Done!',
    };
  }
  catch(err) {
    return err;
  }

  //cardلما عمليه الدفع تتم بنجاح لو هي  webhook دا ال
  async updatePaidCard(payload:any, sig:any, endpointSecret:string){
    let event;

    try {
      event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
    } catch (err) {
      console.log(`Webhook Error: ${err.message}`);
      return;
    }
    switch (event.type) {
      case 'checkout.session.completed':
        const checkoutSessionCompleted = event.data.object;
        const sessionId = checkoutSessionCompleted.id;
        const order = await this.orderModel.findOne({ sessionId });
        if (order) {
          order.isPaid = true;
          order.isDelieverd = true;
          order.paidAt = new Date();
          order.delieverdAt = new Date();

          const cart = await this.cartModel
            .findOne({ user: order.user.toString() })
            .populate('cartItem.productId user');

          // @ts-ignore
          cart.cartItem.forEach(async (item) => {
            await this.productModel.findByIdAndUpdate(
              // @ts-ignore
              item.productId,
              // @ts-ignore
              { $inc: { quantity: -item.quantity, sold: item.quantity } },
              { new: true },
            );
          });

          // reset Cart
          await this.cartModel.findOneAndUpdate(
            { user: order.user.toString() },
            { cartItem: [], totalPrice: 0 },
          );

          await order.save();
          // @ts-ignore
          await cart.save();
        }
        
        // Then define and call a function to handle the event payment_intent.succeeded
        break;
      // ... handle other event types
      
    }
  }
  async findMyOrder(req:any){
    const userId = req.user._id;
    const orders = await this.orderModel.find({ user: userId });
    return {
      status:200,
      message: "Orders found",
      length:orders.length,
      data:orders
    }
  }

  /**
   * جلب جميع الطلبات مع دعم الفلترة، الترتيب، والتقسيم للصفحات (pagination)
   * @param query
   *  - page: رقم الصفحة (افتراضي 1)
   *  - limit: عدد النتائج في الصفحة (افتراضي 10)
   *  - sort: ترتيب النتائج (مثال: -createdAt للأحدث أولاً)
   *  - user: فلترة حسب المستخدم
   *  - isPaid: فلترة حسب حالة الدفع
   *  - isDelieverd: فلترة حسب حالة التوصيل
   *  - ...أي باراميتر آخر سيتم اعتباره فلتر بحث
   * @returns قائمة الطلبات مع معلومات الصفحة والإجمالي
   */
  async findAllOrders(query: any) {
    // إعداد الفلاتر
    const { page = 1, limit = 10, sort = '-createdAt', ...filters } = query;

    // إزالة القيم الفارغة من الفلاتر
    const filter: any = {};
    for (const key in filters) {
      if (filters[key] !== undefined && filters[key] !== '') {
        filter[key] = filters[key];
      }
    }

    // حساب skip للصفحات
    const skip = (Number(page) - 1) * Number(limit);

    // جلب النتائج مع الفلترة والتقسيم والترتيب
    const orders = await this.orderModel
      .find(filter)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));

    // حساب العدد الكلي للنتائج (بدون limit/skip)
    const total = await this.orderModel.countDocuments(filter);

    return {
      status: 200,
      message: 'Orders found',
      length: orders.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      data: orders,
    };
  }
  
  async findAllOrdersByUserId(userId:any){
    const orders = await this.orderModel.find({user:userId});
    if(!orders){
      throw new NotFoundException('not found orders')
    }
    return {
      status: 200,
      message: 'Orders found',
      length: orders.length,
      data: orders,
    };
  }
}
