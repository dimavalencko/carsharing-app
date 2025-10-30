import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { DriverLicenseController } from '@/infrastructure/controllers/driver-license.controller';
import { DriverLicenseService } from '@/application/services/driver-license.service';

@Module({
  imports: [DatabaseModule],
  controllers: [DriverLicenseController],
  providers: [
    {
      provide: 'DriverLicenseService',
      useClass: DriverLicenseService,
    },
  ],
  exports: ['DriverLicenseService'],
})
export class DriverLicenseModule {}
