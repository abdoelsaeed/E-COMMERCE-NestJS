/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { CheckoutCardController, OrderCheckoutController, OrderController } from './order.controller';
import { orderProviders } from './schema/order.provider';
import { DatabaseModule } from 'src/database/database.module';
import { CartModule } from 'src/cart/cart.module';
import { TaxModule } from 'src/tax/tax.module';
import { ProductModule } from 'src/product/product.module';

@Module({
  imports: [DatabaseModule, CartModule, TaxModule, ProductModule],
  controllers: [
    OrderController,
    CheckoutCardController,
    OrderCheckoutController,
  ],
  providers: [OrderService, ...orderProviders],
  exports: [...orderProviders],
})
export class OrderModule {}
