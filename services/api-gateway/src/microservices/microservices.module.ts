import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ServiceNames, EnvConfigService } from '@carsharing/common'

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: ServiceNames.IDENTITY,
        imports: [ConfigModule],
        useFactory: (configService: EnvConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.serviceConfig.identity.host ?? 'localhost',
            port: configService.serviceConfig.identity.port ?? 3001,
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class MicroservicesModule {}