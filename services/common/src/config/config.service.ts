import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EnvConfigService {
  constructor(private configService: ConfigService) {}

  databaseConfig(serviceName: string) {
    const serviceDbName = serviceName.toUpperCase();

    return {
      host: this.configService.get('DB_HOST'),
      port: this.configService.get('DB_PORT'),
      username: this.configService.get('DB_USERNAME'),
      password: this.configService.get('DB_PASSWORD'),
      database: this.configService.get(`${serviceDbName}_DB_NAME`),
    };
  }

  get jwt() {
    return {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: this.configService.get('JWT_EXPIRES_IN'),
      refreshExpiresIn: this.configService.get('REFRESH_TOKEN_EXPIRES_IN'),
    };
  }

  get serviceConfig() {
    return {
      identity: { 
        host: this.configService.get('IDENTITY_SERVICE_HOST'),
        port: this.configService.get('IDENTITY_SERVICE_PORT'),
      },
      booking: { 
        host: this.configService.get('BOOKING_SERVICE_HOST'),
        port: this.configService.get('BOOKING_SERVICE_PORT'),
      },
      cars: { 
        host: this.configService.get('CARS_SERVICE_HOST'),
        port: this.configService.get('CARS_SERVICE_PORT'),
      },
    };
  }

  get isProduction(): boolean {
    return this.configService.get('NODE_ENV') === 'production';
  }

  get isDevelopment(): boolean {
    return this.configService.get('NODE_ENV') === 'development';
  }
}