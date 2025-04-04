import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

const ENV=process.env.NODE_ENV
@Module({
  imports: [UsersModule,ProductsModule,
    ConfigModule.forRoot({
      // envFilePath:['.env.development'],
      envFilePath:!ENV?'.env':`.env.${ENV}`,
      isGlobal:true,       
    }),
    TypeOrmModule.forRootAsync({
      imports:[ConfigModule],
      
      useFactory:(configService:ConfigService)=>({
        type:'postgres',
        synchronize:true,
        autoLoadEntities:true, 
        port:+configService.get('DATABASE_PORT'),  //PORT converted into number from string by (+)
        username:configService.get('DATABASE_USER'),
        password:configService.get('DATABASE_PASSWORD'),
        host:configService.get('DATABASE_HOST'),
        database:configService.get('DATABASE_NAME'), 
      }),
      inject:[ConfigService],
        
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  
}
