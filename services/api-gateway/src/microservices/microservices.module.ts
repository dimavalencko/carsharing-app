import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ServiceNames } from '@carsharing/common'

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: ServiceNames.IDENTITY,
        imports: [ConfigModule],
        useFactory: (envConfigService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: envConfigService.get('IDENTITY_SERVICE_HOST') ?? 'localhost',
            port: envConfigService.get('IDENTITY_SERVICE_PORT') ?? 3001,
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class MicroservicesModule {}