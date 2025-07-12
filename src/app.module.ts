/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { CategoryModule } from './category/category.module';
import { SubCategoryModule } from './sub-category/sub-category.module';
import { BrandModule } from './brand/brand.module';
import { CouponModule } from './coupon/coupon.module';
import { SupplierModule } from './suppliers/suppliers.module';
import { RequestProductModule } from './request-product/requestProduct.module';
import { TaxModule } from './tax/tax.module';
import { ProductModule } from './product/product.module';
import { ReviewModule } from './review/review.module';
import { CartModule } from './cart/cart.module';
import { OrderModule } from './order/order.module';


@Module({
  imports: [
    ConfigModule.forRoot(),
    MailerModule.forRoot({
      transport: {
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
        tls: {
          rejectUnauthorized: false, // تجاوز التحقق من الشهادة
        },
      },
    }),
    MongooseModule.forRoot(
      process.env.DB ||
        'mongodb+srv://abdoelsaeed2:12345@cluster000.h7jdjme.mongodb.net/e-commerceNestJs?retryWrites=true&w=majority&appName=Cluster000',
    ),
    UserModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'your-very-secure-secret-key',
      signOptions: { expiresIn: '6000000s' },
    }),
    AuthModule,
    CategoryModule,
    SubCategoryModule,
    BrandModule,
    CouponModule,
    SupplierModule,
    RequestProductModule,
    TaxModule,
    ProductModule,
    ReviewModule,
    CartModule,
    OrderModule,
  ],
  controllers: [],
})
export class AppModule {}
