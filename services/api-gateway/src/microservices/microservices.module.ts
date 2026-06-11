import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ServiceNames } from '@carsharing/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: ServiceNames.IDENTITY,
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get('IDENTITY_HOST', 'localhost'),
            port: configService.get('IDENTITY_PORT', 4001),
          },
        }),
        inject: [ConfigService],
      },
      {
        name: ServiceNames.CARS,
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get('CARS_SERVICE_HOST', 'localhost'),
            port: parseInt(configService.get('CARS_SERVICE_PORT', '3003'), 10),
          },
        }),
        inject: [ConfigService],
      },
      {
        name: ServiceNames.BOOKING,
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get('BOOKING_SERVICE_HOST', 'localhost'),
            port: parseInt(configService.get('BOOKING_SERVICE_PORT', '3002'), 10),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class MicroservicesModule {}