import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Products } from './products/products.entity';

@Module({
  imports: [UsersModule,ProductsModule,
    TypeOrmModule.forRootAsync({
      imports:[],
      inject:[],
      useFactory:()=>({
        type:'postgres',
        entities:[Products],
        synchronize:true,
        autoLoadEntities:true,
        port:5432,
        username:'',
        password:'',
        database:''
      })
        
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
