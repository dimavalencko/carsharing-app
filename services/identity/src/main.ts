import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './modules/app/app.module';

async function bootstrap() {
  try {
    const configService = new ConfigService();
    const nodeEnv: string = configService.get('NODE_ENV', 'development');
    const servicePort: number = configService.get('SERVICE_PORT', 3001);

    const microservice = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: servicePort,
        },
      },
    );

    microservice.enableShutdownHooks();
    await microservice.listen();
    console.log(`✅ Microservice successfully started on port ${servicePort}`);
  } 
  catch (error) {
    console.error('❌ Failed to start microservice:', error);
    process.exit(1);
  }
}

bootstrap();