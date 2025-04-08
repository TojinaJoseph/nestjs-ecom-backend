import { forwardRef, Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './providers/cart.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartItem } from './cart-item.entity';
import { Users } from 'src/users/users.entity';
import { Cart } from './cart.entity';
import { ProductsModule } from 'src/products/products.module';
import { Products } from 'src/products/products.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports:[TypeOrmModule.forFeature([CartItem,Cart,Users,Products]),forwardRef(()=>ProductsModule)],
  controllers: [CartController],
  providers: [CartService],
  exports:[CartService]
})
export class CartModule {}
