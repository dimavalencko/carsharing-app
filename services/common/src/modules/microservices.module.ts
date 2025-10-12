// common/src/microservices/microservices.module.ts
import { DynamicModule, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { EnvConfigService } from '../config/config.service';
import { ServiceNames } from '../constants';

@Module({})
export class MicroservicesModule {
  static forRoot(): DynamicModule {
    return {
      module: MicroservicesModule,
      imports: [
        ClientsModule.registerAsync([
          {
            name: ServiceNames.IDENTITY,
            useFactory: (envConfigService: EnvConfigService) => ({
              transport: Transport.TCP,
              options: {
                host: envConfigService.serviceConfig.identity.host || 'localhost',
                port: envConfigService.serviceConfig.identity.port || 3001,
              },
            }),
            inject: [EnvConfigService],
          },
          {
            name: ServiceNames.BOOKING,
            useFactory: (envConfigService: EnvConfigService) => ({
              transport: Transport.TCP,
              options: {
                host: envConfigService.serviceConfig.booking.host || 'localhost',
                port: envConfigService.serviceConfig.booking.port || 3002,
              },
            }),
            inject: [EnvConfigService],
          },
          {
            name: ServiceNames.CARS,
            useFactory: (envConfigService: EnvConfigService) => ({
              transport: Transport.TCP,
              options: {
                host: envConfigService.serviceConfig.cars.host || 'localhost',
                port: envConfigService.serviceConfig.cars.port || 3003,
              },
            }),
            inject: [EnvConfigService],
          },
        ]),
      ],
      exports: [ClientsModule],
    };
  }
}