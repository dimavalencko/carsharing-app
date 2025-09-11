import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { IdentityService } from './identity.service';
import { RegisterDto } from './auth/dto/register.dto';
import { LoginDto } from './auth/dto/login.dto';
import { ApiOperation, ApiResponse, ApiBody, ApiTags } from '@nestjs/swagger';

@ApiTags('Identity Service - Microservices')
@Controller()
export class IdentityController {
  constructor(private readonly identityService: IdentityService) {}

  @ApiOperation({ summary: 'Register new user (Microservice)' })
  @ApiResponse({ 
    status: 201, 
    description: 'User successfully registered',
    schema: {
      example: {
        id: 'uuid',
        email: 'user@example.com',
        firstName: 'John',
        lastName: 'Doe',
        isActive: true,
        createdAt: '2023-12-12T12:00:00.000Z'
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 409, description: 'User already exists' })
  @ApiBody({ type: RegisterDto })
  @MessagePattern('identity_register')
  async register(@Payload() registerDto: RegisterDto) {
    return this.identityService.register(registerDto);
  }

  @ApiOperation({ summary: 'User login (Microservice)' })
  @ApiResponse({ 
    status: 200, 
    description: 'Login successful',
    schema: {
      example: {
        id: 'uuid',
        email: 'user@example.com',
        firstName: 'John',
        lastName: 'Doe',
        isActive: true,
        createdAt: '2023-12-12T12:00:00.000Z'
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ApiBody({ type: LoginDto })
  @MessagePattern('identity_login')
  async login(@Payload() loginDto: LoginDto) {
    return this.identityService.login(loginDto);
  }

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

  @ApiOperation({ summary: 'Update user settings (Microservice)' })
  @ApiResponse({ 
    status: 200, 
    description: 'Settings updated',
    schema: {
      example: {
        id: 'uuid',
        email: 'user@example.com',
        firstName: 'John',
        lastName: 'Doe',
        isActive: true,
        settings: { theme: 'dark' },
        createdAt: '2023-12-12T12:00:00.000Z'
      }
    }
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @MessagePattern('identity_update_settings')
  async updateSettings(@Payload() data: { userId: string; settings: any }) {
    return this.identityService.updateUserSettings(data.userId, data.settings);
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