import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  // Use `PORT` provided in environment or default to 3000
  const port = process.env.PORT || 3000;

  app.use('/images', express.static('images'));

  const config = new DocumentBuilder()
    .setTitle('Web Himakom API')
    .setDescription('Dokumentasi API Website Himakom Stikom Poltek Cirebon')
    .setVersion('1')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.enableCors({ origin: '*' });
  await app.listen(port, '0.0.0.0');
}
bootstrap();
