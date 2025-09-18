import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthController } from '@infrastructure/controllers/health.controller';
import { HealthService } from '@infrastructure/services/health.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@/domain/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),
  ],
  controllers: [HealthController],
  providers: [HealthService],
})
export class HealthModule {}
