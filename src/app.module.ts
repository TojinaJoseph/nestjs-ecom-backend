import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import jwtConfig from './auth/config/jwt.config';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AccessTokenGuard } from './auth/guards/access-token/access-token.guard';
import  appConfig  from './config/app.config';
import databaseConfig from './config/database.config';
import environmentValidation from './config/environment.validation';
import { AuthenticationGuard } from './auth/guards/authentication/authentication.guard';
import { CartModule } from './cart/cart.module';
import { RolesGuard } from './auth/guards/roles/roles.guard';
import { PaginationModule } from './common/pagination/pagination.module';
import { OrderModule } from './order/order.module';
import { UploadModule } from './upload/upload.module';

const ENV=process.env.NODE_ENV
@Module({
  imports: [
    UsersModule,
    ProductsModule,
    ConfigModule.forRoot({
      // envFilePath:['.env.development'],
      envFilePath:!ENV?'.env':`.env.${ENV}`,
      isGlobal:true, 
      load:[appConfig,databaseConfig] ,
      validationSchema: environmentValidation     
    }),
    TypeOrmModule.forRootAsync({
      imports:[ConfigModule],
      
      useFactory:(configService:ConfigService)=>({
        type:'postgres',
        url:configService.get('database.url'),
        ssl: {
          rejectUnauthorized: false,
        },
        autoLoadEntities:configService.get('database.autoLoadEntities'),
        synchronize:configService.get('database.synchronize') ,       //should be false for production
        // port:+configService.get('database.port'),  //PORT converted into number from string by (+)
        // username:configService.get('database.user'),
        // password:configService.get('database.password'),
        // host:configService.get('database.host'),
        // database:configService.get('database.name'),
      }),
      inject:[ConfigService],
        
    }),
    AuthModule,
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync(jwtConfig.asProvider()),
    CartModule,
    PaginationModule,
    OrderModule,
    UploadModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
     {
          provide: APP_GUARD,
          useClass: AuthenticationGuard
        } ,   // entire application is now protected
        AccessTokenGuard,
        {
          provide: APP_GUARD,
          useClass: RolesGuard,
        },
  ],
})
export class AppModule {
  
}
