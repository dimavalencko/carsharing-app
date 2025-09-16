import { Controller } from '@nestjs/common';
import { HealthService } from '../services/health.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}
  @MessagePattern('identity_health')
  async checkHealth() {
    return this.healthService.checkHealth();
  }

  @MessagePattern('db_health')
  async checkDatabase() {
    return this.healthService.checkDatabase();
  }
}