import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { DriverLicenseController } from '@/infrastructure/controllers/driver-license.controller';
import { DriverLicenseService } from '@/application/services/driver-license.service';
import type { IDriverLicenseRepository, IUserRepository } from '@/domain/interfaces/repositories';

@Module({
  imports: [DatabaseModule],
  controllers: [DriverLicenseController],
  providers: [
    {
      provide: 'DriverLicenseService',
      useFactory: (
        driverLicenseRepository: IDriverLicenseRepository,
        userRepository: IUserRepository,
      ) => {
        return new DriverLicenseService(driverLicenseRepository, userRepository);
      },
      inject: ['IDriverLicenseRepository', 'IUserRepository'],
    },
  ],
  exports: ['DriverLicenseService'],
})
export class DriverLicenseModule {}
