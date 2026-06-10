import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ServiceNames } from '@carsharing/common';
import { BookingController } from '@/infrastructure/controllers/booking.controller';
import { BookingManagementService } from '@/application/services/booking-management.service';
import { CarsClientService } from '@/application/services/cars-client.service';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: ServiceNames.CARS,
        imports: [ConfigModule],
        useFactory: (config: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: config.get('CARS_SERVICE_HOST', 'localhost'),
            port: parseInt(config.get('CARS_SERVICE_PORT', '3003'), 10),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [BookingController],
  providers: [BookingManagementService, CarsClientService],
})
export class BookingModule {}
