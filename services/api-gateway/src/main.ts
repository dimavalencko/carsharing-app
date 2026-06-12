import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AllExceptionsFilter } from './filters/http-exception.filter';
import cookieParser from 'cookie-parser';
import * as express from 'express';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  const app = await NestFactory.create(AppModule, { bodyParser: false });
  const configService = app.get(ConfigService);

  const BODY_LIMIT = '5mb';
  app.use(express.json({ limit: BODY_LIMIT }));
  app.use(express.urlencoded({ limit: BODY_LIMIT, extended: true }));
  app.use(cookieParser());

  app.enableCors({
    origin: configService.get('CORS_ORIGIN', 'http://localhost:3000'),
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.useGlobalFilters(new AllExceptionsFilter());

  app.setGlobalPrefix('api');

  const port = configService.get('PORT', 3000);
  await app.listen(port);

  logger.log(`🚀 API Gateway is running on port ${port}`);
  logger.log(`📡 Environment: ${configService.get('NODE_ENV', 'development')}`);
  logger.log(`🌐 CORS enabled for: ${configService.get('CORS_ORIGIN', 'http://localhost:3000')}`);
  logger.log(`📍 Global prefix: /api`);
}

bootstrap();
