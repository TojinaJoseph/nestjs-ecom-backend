import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder,SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { DataResponseInterceptor } from './common/interceptors/data-response/data-response.interceptor';
import { API_BEARER_AUTH } from './common/constants/auth.constants';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  // const app = await NestFactory.create(AppModule);
  const app = await NestFactory.create<NestExpressApplication>(AppModule);   //for image uploads


  app.enableCors({
    origin: ['http://localhost:5173','https://tojinajoseph.github.io'] ,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Define allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Define allowed headers// or specific origin
    credentials: true,
  });


//swagger configuration with database

  const config=new DocumentBuilder()
  .setTitle('Ecommerce-backend API')
  .setDescription('Use the base API url as http://localhost:3000')
  .addServer('http://localhost:3000')
  .setVersion('1.0')
  .addBearerAuth(
    {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'Authorization',
      in: 'header',
    },
    API_BEARER_AUTH
    // 'access-token', // security name 
  )
  .build();
  const document=SwaggerModule.createDocument(app,config);
  SwaggerModule.setup('api',app,document);

  //configuration for validationpipes

  app.useGlobalPipes(new ValidationPipe(
    {
      whitelist:true,
      forbidNonWhitelisted:true,
      transform:true,
      transformOptions:{
        enableImplicitConversion: true      //instead of using Type from class-transformer to type conversion in each dto
      }
    }
  ))

  app.useGlobalInterceptors(new DataResponseInterceptor());   //interceptors for changing response object
  // Serve static files from /uploads directory
  // app.useStaticAssets(join(__dirname, '..', 'uploads'), {
  //   prefix: '/uploads', // So files can be accessed via http://localhost:3000/uploads/filename.jpg
  // });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
