import { Controller } from '@nestjs/common';
import { HealthService, HealthDbStatus } from '../services/health.service';
import type { HealthStatus } from '../services/health.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @MessagePattern('identity.health.check')
  checkHealth(): HealthStatus {
    return this.healthService.checkHealth();
  }

  @MessagePattern('identity.health.check_db')
  checkDatabase(): Promise<HealthDbStatus> {
    return this.healthService.checkDatabase();
  }
}
