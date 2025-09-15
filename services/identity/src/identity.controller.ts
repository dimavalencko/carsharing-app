import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { IdentityService } from './identity.service';
import { ApiOperation, ApiResponse, ApiBody, ApiTags } from '@nestjs/swagger';

@ApiTags('Identity Service - Microservices')
@Controller()
export class IdentityController {
  constructor(private readonly identityService: IdentityService) {}

  @ApiOperation({ summary: 'Get user by ID (Microservice)' })
  @ApiResponse({ 
    status: 200, 
    description: 'User found',
    schema: {
      example: {
        id: 'uuid',
        email: 'user@example.com',
        firstName: 'John',
        lastName: 'Doe',
        isActive: true,
        settings: {},
        createdAt: '2023-12-12T12:00:00.000Z'
      }
    }
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @MessagePattern('identity_get_user')
  async getUser(@Payload() userId: string) {
    return this.identityService.getUserById(userId);
  }

  @ApiOperation({ summary: 'Health check (Microservice)' })
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
  @MessagePattern('identity_health')
  async healthCheck() {
    return { status: 'healthy', service: 'identity', timestamp: new Date() };
  }
}