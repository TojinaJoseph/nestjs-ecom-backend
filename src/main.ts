import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder,SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);


  const config=new DocumentBuilder()
  .setTitle('Ecommerce-app API')
  .setDescription('Use the base API url as http://localhost:3000')
  .addServer('http://localhost:3000')
  .setVersion('1.0')
  .build();
  const document=SwaggerModule.createDocument(app,config);
  SwaggerModule.setup('api',app,document);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
