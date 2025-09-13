import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { IdentityModule } from './identity.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { createDatabaseIfNotExists } from 'scripts/create-database';

async function bootstrap() {
  const configService = new ConfigService();
  const nodeEnv = configService.get('NODE_ENV', 'development');
  const httpEnabled = configService.get('ENABLE_HTTP', 'false') === 'true';
  const docsPort = configService.get('API_DOCS_PORT', 3002);
  const servicePort = configService.get('SERVICE_PORT', 3001);

  // Создаем БД при запуске в development-режиме, независимо от типа приложения (TCP/HTTP)
  if (nodeEnv === 'development') {
    try {
      await createDatabaseIfNotExists();
    } 
    catch (error) {
      process.exit(1);
    }
  }

  // Всегда создаем и запускаем TCP-микросервис (основной функционал)
  const microservice = await NestFactory.createMicroservice<MicroserviceOptions>(
    IdentityModule,
    {
      transport: Transport.TCP,
      options: {
        host: '0.0.0.0',
        port: servicePort,
      },
    },
  );

  // Запускаем микросервис в фоне
  await microservice.listen();

  // В development-режиме с флагом HTTP - поднимаем Swagger
  if (nodeEnv === 'development' && httpEnabled) {
    const app = await NestFactory.create(IdentityModule);

    const config = new DocumentBuilder()
      .setTitle('Identity Service API')
      .setDescription('Микросервис для аутентификации и управления пользователями')
      .setVersion('1.0')
      .build();
    
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api-docs', app, document);
    
    await app.listen(docsPort);
  }
}

bootstrap();