import { Module } from '@nestjs/common';
import { HealthController } from '@/infrastructure/controllers/health.controller';
import { HealthService } from '@/infrastructure/services/health.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [HealthController],
  providers: [HealthService],
  exports: [HealthService],
})
export class HealthModule {}