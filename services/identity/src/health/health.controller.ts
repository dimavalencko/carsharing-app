import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HealthService } from './health.service';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @ApiOperation({ summary: 'Check service health' })
  @ApiResponse({ 
    status: 200, 
    description: 'Service is healthy',
    schema: {
      example: {
        status: 'healthy',
        service: 'identity',
        timestamp: '2023-12-12T12:00:00.000Z'
      }
    }
  })
  @ApiResponse({ 
    status: 500, 
    description: 'Service is unhealthy',
    schema: {
      example: {
        status: 'unhealthy',
        error: 'Database connection failed'
      }
    }
  })
  async checkHealth() {
    return this.healthService.checkHealth();
  }

  @Get('database')
  @ApiOperation({ summary: 'Check database connection' })
  @ApiResponse({ 
    status: 200, 
    description: 'Database is connected',
    schema: {
      example: {
        database: 'connected',
        timestamp: '2023-12-12T12:00:00.000Z'
      }
    }
  })
  async checkDatabase() {
    return this.healthService.checkDatabase();
  }
}