import { Controller, Get } from '@nestjs/common';
import { HealthService } from './health.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @ApiOperation({ summary: 'Get health status of all microservices' })
  async checkHealth() {
    const startTime = Date.now();
    const services = await this.healthService.checkAllServices();
    
    const overallStatus = this.determineOverallStatus(services);
    
    return {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      responseTime: Date.now() - startTime,
      services: services
    };
  }

  private determineOverallStatus(services: any): string {
    for (const serviceName in services) {
      if (services[serviceName].status !== 'healthy') {
        return 'unhealthy';
      }
    }
    return 'healthy';
  }
}