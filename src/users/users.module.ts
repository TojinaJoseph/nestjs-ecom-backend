import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './providers/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './users.entity';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports:[TypeOrmModule.forFeature([Users])]
})
export class UsersModule {}
