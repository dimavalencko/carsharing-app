import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MicroservicesModule } from './microservices/microservices.module';
import { UsersController } from './microservices/identity/controllers/users.controller';
import { HealthModule } from './health/health.module';
import { HealthController } from './health/health.controller';
import { IdentityModule } from './microservices/identity/identity.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        '.env',
        `.env.${process.env.NODE_ENV || 'development'}`,
      ]
    }),
    IdentityModule,
    MicroservicesModule,
    HealthModule
  ],
  controllers: [AppController, UsersController, HealthController],
  providers: [AppService],
})

export class AppModule {}