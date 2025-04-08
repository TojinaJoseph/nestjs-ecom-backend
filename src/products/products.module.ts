import { forwardRef, Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './providers/products.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Products } from './products.entity';
import { CartModule } from 'src/cart/cart.module';
import { CartItem } from 'src/cart/cart-item.entity';
// import { CartItem } from 'src/cart/cart-item.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Products,CartItem]),forwardRef(()=>CartModule)],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports:[ProductsService]
})
export class ProductsModule {
    
}
