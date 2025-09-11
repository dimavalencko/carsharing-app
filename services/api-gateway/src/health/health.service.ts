import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, timeout } from 'rxjs';

export interface ServiceHealth {
  status: string;
  service: string;
  responseTime?: number;
  timestamp?: string;
  error?: string;
}

@Injectable()
export class HealthService {
  constructor(
    @Inject('IDENTITY') private readonly identityClient: ClientProxy,
  ) {}

  async checkServiceHealth(serviceName: string, client: ClientProxy, pattern: string): Promise<ServiceHealth> {
    const startTime = Date.now();
    
    try {
      const response = await firstValueFrom(
        client.send(pattern, {}).pipe(timeout(5000))
      );
      
      return {
        status: 'healthy',
        service: serviceName,
        responseTime: Date.now() - startTime,
        timestamp: new Date().toISOString(),
        ...response
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        service: serviceName,
        error: error.message,
        responseTime: Date.now() - startTime,
        timestamp: new Date().toISOString()
      };
    }
  }

  async checkAllServices() {
    const services = {};
    
    // Проверяем Identity Service
    services['identity'] = await this.checkServiceHealth(
      'identity', 
      this.identityClient, 
      'identity_health'
    );

    // Статус самого API Gateway
    services['apiGateway'] = {
      status: 'healthy',
      service: 'api-gateway',
      timestamp: new Date().toISOString()
    };

    return services;
  }
}