import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';
import { ShippingAddress } from './shipping-address.entity';
import { OrderService } from './providers/orderService';
import { CartModule } from 'src/cart/cart.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [OrderController],
  imports:[TypeOrmModule.forFeature([Order,OrderItem,ShippingAddress]),CartModule,UsersModule],
  providers: [OrderService]
})
export class OrderModule {}
