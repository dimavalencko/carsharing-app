import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './modules/app/app.module';

async function bootstrap() {
  try {
    const configService = new ConfigService();
    const nodeEnv: string = configService.get('NODE_ENV', 'development');
    const httpEnabled: boolean = configService.get('ENABLE_HTTP', 'false') === 'true';
    const docsPort: number = configService.get('API_DOCS_PORT', 3002);
    const servicePort: number = configService.get('SERVICE_PORT', 3001);

    // Всегда создаем и запускаем TCP-микросервис (основной функционал)
    const microservice =
      await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
        transport: Transport.TCP,
        options: {
          host: '0.0.0.0',
          port: servicePort,
        },
      },
    );
    microservice.enableShutdownHooks();
    await microservice.listen();
    console.log(`✅ Microservice successfully started on port ${servicePort}`);

    // В development-режиме с флагом HTTP - поднимаем Swagger
    if (nodeEnv === 'development' && httpEnabled) {
      const app = await NestFactory.create(AppModule);

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
  catch (error) {
    console.error('❌ Failed to start microservice:', error);
    process.exit(1);
  }
}

bootstrap();