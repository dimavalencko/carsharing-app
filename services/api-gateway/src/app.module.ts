import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MicroservicesModule } from './microservices/microservices.module';
import { IdentityController } from './microservices/identity/identity.controller';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MicroservicesModule,
    HealthModule
  ],
  controllers: [AppController, IdentityController],
  providers: [AppService],
})
export class AppModule {}