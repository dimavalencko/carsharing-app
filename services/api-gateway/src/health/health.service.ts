import { ServiceNames } from '@carsharing/common';
import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, timeout } from 'rxjs';
import type { ServiceHealth } from '@carsharing/common' 



@Injectable()
export class HealthService {
  constructor(
    @Inject(ServiceNames.IDENTITY) private readonly identityClient: ClientProxy,
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
        dbHealth: 'healthy',
        errorMessage: error.message,
        responseTime: Date.now() - startTime,
        timestamp: new Date().toISOString()
      };
    }
  }

  async checkAllServices() {
    const healthResult: {[serviceName: string]: ServiceHealth} = {};
    const startTime = Date.now();
    
    // Проверяем Identity Service
    healthResult['identity'] = await this.checkServiceHealth(
      'identity', 
      this.identityClient, 
      'identity_health'
    );

    // Статус самого API Gateway
    healthResult['apiGateway'] = {
      status: 'healthy',
      service: 'api-gateway',
      timestamp: new Date().toISOString(),
      responseTime: Date.now() - startTime,
    };

    return healthResult;
  }
}