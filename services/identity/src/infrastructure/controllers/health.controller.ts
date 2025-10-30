import { Controller } from '@nestjs/common';
import { IdentityEndpoints } from '@carsharing/common';
import { HealthService, HealthDbStatus } from '../services/health.service';
import type { HealthStatus } from '../services/health.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @MessagePattern(IdentityEndpoints.HEALTH.CHECK)
  checkHealth(): HealthStatus {
    return this.healthService.checkHealth();
  }

  @MessagePattern(IdentityEndpoints.HEALTH.CHECK_DB)
  checkDatabase(): Promise<HealthDbStatus> {
    return this.healthService.checkDatabase();
  }
}
