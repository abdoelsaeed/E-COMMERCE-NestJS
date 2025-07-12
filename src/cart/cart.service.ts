/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { HttpException, Inject, Injectable } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { Model } from 'mongoose';
import { Cart } from './interfaces/cart.interface';
import { Product } from 'src/product/interfaces/product.interface';
import { Coupon } from 'src/coupon/interfaces/coupon.interface';

@Injectable()
export class CartService {
  constructor(
    @Inject('CART_MODEL') private cartModel: Model<Cart>,
    @Inject('PRODUCT_MODEL') private productModel: Model<Product>,
    @Inject('COUPON_MODEL') private couponModel: Model<Coupon>,
  ) {}
  async create(productId: string, req: any) {
    const userId = req.user._id;
    // التحقق من المنتج
    const product = await this.productModel.findById(productId);
    
    if (!product) {
      throw new HttpException('No product with this Id', 404);
    }
    if (product.quantity <= 0) {
      throw new HttpException('This product is out of stock', 400);
    }

    // البحث عن عربة المستخدم
    const cart = await this.cartModel.findOne({ user: userId });
    // eslint-disable-next-line
    // @ts-ignore

    try {
      if (cart) {
        // البحث عن المنتج في العربة
        const existingItem = cart.cartItem.find((item) => {
          // eslint-disable-next-line
          // @ts-ignore

          return item.productId.toString() === productId.toString();
        });

        if (existingItem) {
          // تحديث الكمية والسعر
          // eslint-disable-next-line
          // @ts-ignore
          existingItem.quantity += 1;
          // eslint-disable-next-line
          // @ts-ignore
          cart.totalPrice += product.priceAfterDicount;
        } else {
          // إضافة منتج جديد إلى العربة
          // eslint-disable-next-line
          // @ts-ignore
          cart.cartItem.push({ productId, quantity: 1, color: '' });
          // eslint-disable-next-line
          // @ts-ignore
          cart.totalPrice += product.priceAfterDicount;
        }

        // حفظ التغييرات
        await cart.save({ validateBeforeSave: false });
        return {
          status: 200,
          message: 'insert product successfully',
          data: await cart.populate(
            'cartItem.productId',
            'title price discount priceAfterDicount',
          ),
        };
      } else {
        // إنشاء عربة جديدة
        const newCart = await this.cartModel.create({
          cartItem: [{ productId, quantity: 1 }],
          // eslint-disable-next-line
          // @ts-ignore
          totalPrice: product.priceAfterDicount,
          user: userId,
        });
        const data = await newCart.populate(
          'cartItem.productId',
          'title price discount priceAfterDicount',
        );
        return {
          status: 201,
          message: 'Cart created successfully',
          // eslint-disable-next-line
          // @ts-ignore
          data
        };
      }
    } catch (err: any) {
      
      throw new HttpException(
        'An error occurred while processing your request',
        500,
      );
    }
  }

  async findAll() {
    const cart = await this.cartModel
      .find()
      .populate(
        'cartItem.productId',
        'title price discount priceAfterDicount quantity',
      );
    if (!cart) {
      throw new HttpException('No found carts', 404);
    }
    return {
      status: 200,
      message: 'Cart found successfully',
      length: cart.length,
      data: cart,
    };
  }

  async findOne(req: any) {
    const userId = req.user._id;
    const cart = await this.cartModel
      .findOne({ user: userId })
      .populate(
        'cartItem.productId',
        'title price discount priceAfterDicount quantity',
      );
    if (!cart) {
      throw new HttpException('you dont have cart', 404);
    }
    return {
      status: 200,
      message: 'Cart found successfully',
      data: cart,
    };
  }

  async update(id: string, updateCartDto: UpdateCartDto, req: any) {
    const userId = req.user._id;
    const cart = await this.cartModel
      .findOne({ user: userId })
      .populate(
        'cartItem.productId',
        'title price discount priceAfterDicount quantity',
      );
    if (!cart) {
      throw new HttpException('you dont have cart', 404);
    }
    const { quantity, color } = updateCartDto;
    const product = await this.productModel.findById(id);
    if (!product) {
      throw new HttpException('No product with this Id', 404);
    }
    // eslint-disable-next-line
    // @ts-ignore
    const item = cart.cartItem.find((item) => item.productId._id.toString() === id.toString(),);
    if (!item) {
      throw new HttpException('No found this Id in your cart', 404);
    }
    if (quantity) {
      // eslint-disable-next-line
      // @ts-ignore
      if (quantity > item.productId.quantity) {
        throw new HttpException('This product is out of stock', 400);
      }
      // eslint-disable-next-line
      // @ts-ignore
      const oldPrice = item.productId.priceAfterDicount * item.quantity;
      // eslint-disable-next-line
      // @ts-ignore
      const newPrice = item.productId.priceAfterDicount * quantity;
      // eslint-disable-next-line
      // @ts-ignore
      const oldQuantity = item.quantity;
      // eslint-disable-next-line
      // @ts-ignore
      item.quantity = quantity;
      cart.totalPrice = cart.totalPrice - oldPrice + newPrice;

    }
    if (color) {
      // eslint-disable-next-line
      // @ts-ignore
      item.color = color;
    }
    await cart.save({ validateBeforeSave: false });
    return {
      status: 200,
      message: 'Cart updated successfully',
    };
  }

  async remove(id: string, req: any) {
    const userId = req.user._id;
    const cart = await this.cartModel
      .findOne({ user: userId })
      .populate('cartItem.productId', 'title price discount priceAfterDicount');
    if (!cart) {
      throw new HttpException('No cart with this Id', 404);
    }

    let checkProduct = false;
    const newCartItem = cart.cartItem.filter((item) => {
      // eslint-disable-next-line
      // @ts-ignore
      if (item.productId._id.toString() === id.toString()) {
        // eslint-disable-next-line
        // @ts-ignore
        const priceAfterDiscount = item.productId.priceAfterDicount;

        // eslint-disable-next-line
        // @ts-ignore
        cart.totalPrice -= priceAfterDiscount * item.quantity;

        checkProduct = true;
        return false;
      } else {
        // eslint-disable-next-line
        // @ts-ignore
        // eslint-disable-next-line
        // @ts-ignore
        return true;
      }
    });
    if (!checkProduct) {
      throw new HttpException('No found this Id in your cart', 404);
    }
    // eslint-disable-next-line
    // @ts-ignore
    cart.cartItem = newCartItem;
    await cart.save({ validateBeforeSave: false });
    return {
      status: 200,
      message: 'Product removed successfully',
      data: await cart.populate(
        'cartItem.productId',
        'title price discount priceAfterDicount',
      ),
    };
  }
  async applyCoupon(req: any, couponName: string) {
    
    const userId = req.user._id;
    const coupon = await this.couponModel.findOne({ name: couponName });
    

    if (!coupon || new Date(coupon.expireDate) < new Date()) {
      throw new HttpException('Invalid coupon', 404);
    }
    const cart = await this.cartModel.findOne({ user: userId });
    // eslint-disable-next-line
    // @ts-ignore
    const ifCouponUsed = cart.coupons.find(
      (coupon) => coupon.name === couponName,
    );
    if (ifCouponUsed) {
      throw new HttpException('You already used this coupon', 400);
    }
    // eslint-disable-next-line
    // @ts-ignore
    cart.coupons.push({ name: coupon.name, couponId: coupon._id.toString() });
    // eslint-disable-next-line
    // @ts-ignore
    cart.totalPriceAfterDiscount =cart.totalPrice - (cart?.totalPrice * coupon.discount) / 100;
    // eslint-disable-next-line
    // @ts-ignore
    if (cart.totalPriceAfterDiscount < 0) {
      throw new HttpException('you have full discount', 400);
    }
    // eslint-disable-next-line
    // @ts-ignore
    await cart.save({ validateBeforeSave: false });
    return {
      status: 200,
      message: 'Coupon applied successfully',
      data: cart,
    };
  }
  async findCart(id:string){
    const cart = await this.cartModel.findById(id);
    if(!cart){
      throw new HttpException('No cart with this Id', 404);
    }
    return {
      status: 200,
      message: 'Cart found successfully',
      data: cart,
    };
  }
}
