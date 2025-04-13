import { forwardRef, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './providers/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './users.entity';
import { AuthModule } from 'src/auth/auth.module';
import { CreateUserProvider } from './providers/create-user.provider';
import { FindOneUserByEmailProvider } from './providers/find-one-user-by-email.provider';
import { Cart } from 'src/cart/cart.entity';
@Module({
  controllers: [UsersController],
  providers: [
    UsersService, 
    CreateUserProvider, 
    FindOneUserByEmailProvider
  ],
  imports:[
    TypeOrmModule.forFeature([Users,Cart]),   //autoloading entities in database
    forwardRef(()=>AuthModule),
  ] ,     //using user entity
  exports:[UsersService]

})
export class UsersModule {}
