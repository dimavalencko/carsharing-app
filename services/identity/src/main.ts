import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { IdentityModule } from './identity.module';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  // Для микросервиса
  const microservice = await NestFactory.createMicroservice<MicroserviceOptions>(
    IdentityModule,
    {
      transport: Transport.TCP,
      options: {
        host: '0.0.0.0',
        port: 3001,
      },
    },
  );
  
  // Для Swagger документации (HTTP сервер)
  const app = await NestFactory.create(IdentityModule);
  
  const config = new DocumentBuilder()
    .setTitle('Identity Service API')
    .setDescription('Microservice for user authentication and management')
    .setVersion('1.0')
    .addTag('auth', 'Authentication operations')
    .addTag('users', 'User management operations')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);
  
  await app.listen(3002); // Другой порт для документации
  console.log('Identity Service is listening on port 3001 (microservice)');
  console.log('Swagger documentation available at http://localhost:3002/api-docs');
  
  await microservice.listen();
}
bootstrap();