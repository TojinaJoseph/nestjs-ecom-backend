import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder,SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { DataResponseInterceptor } from './common/interceptors/data-response/data-response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

//swagger configuration

  const config=new DocumentBuilder()
  .setTitle('Ecommerce-app API')
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
    'access-token', // security name 
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
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
