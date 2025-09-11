import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  
  // Включаем CORS для фронтенда
  app.enableCors({
    origin: configService.get('CORS_ORIGIN', 'http://localhost:3000'),
    credentials: true,
  });
  
  // Глобальная валидация DTO
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));
  
  const port = configService.get('PORT', 3000);
  await app.listen(port);
  
  console.log(`API Gateway is running on port ${port}`);
  console.log(`Environment: ${configService.get('NODE_ENV')}`);
}
bootstrap();