import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HealthService } from './health.service';
import { MessagePattern } from '@nestjs/microservices';

@ApiTags('Health')
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