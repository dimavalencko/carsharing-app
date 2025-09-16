import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthController } from '@infrastructure/controllers/health.controller';
import { HealthService } from '@infrastructure/services/health.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),
  ],
  controllers: [HealthController],
  providers: [HealthService],
})
export class HealthModule {}
