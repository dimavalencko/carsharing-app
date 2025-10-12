import { DriverLicenseController } from '@/infrastructure/controllers/driver-license.controller';
import { UserEntity, DriverLicenseEntity, UserRoleEntity } from '@/infrastructure/persistence/typeorm';
import { DriverLicenseRepository } from '@/infrastructure/repositories/driver-license.repository';
import { UserRepository } from '@/infrastructure/repositories/user.repository';
import { DriverLicenseService } from '@/infrastructure/services/driver-license.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRoleEntity, UserEntity, DriverLicenseEntity]),
  ],
  controllers: [DriverLicenseController],
  providers: [
    DriverLicenseService,
    {
      provide: 'IDriverLicenseRepository',
      useClass: DriverLicenseRepository,
    },
    {
      provide: 'IUserRepository',
      useClass: UserRepository,
    },
  ],
  exports: [DriverLicenseService],
})
export class DriverLicenseModule {}