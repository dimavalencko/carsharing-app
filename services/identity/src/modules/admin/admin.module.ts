import { AdminController } from '@/infrastructure/controllers/admin.controller';
import { UserEntity, UserProfileEntity, DriverLicenseEntity, RefreshTokenEntity, UserRoleEntity } from '@/infrastructure/persistence/typeorm';
import { DriverLicenseRepository } from '@/infrastructure/repositories/driver-license.repository';
import { RefreshTokenRepository } from '@/infrastructure/repositories/refresh-token.repository';
import { UserProfileRepository } from '@/infrastructure/repositories/user-profile.repository';
import { UserRoleRepository } from '@/infrastructure/repositories/user-role.repository';
import { UserRepository } from '@/infrastructure/repositories/user.repository';
import { AdminService } from '@/infrastructure/services/admin.service';
import { RoleService } from '@/infrastructure/services/roles.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRoleEntity, UserEntity, UserProfileEntity, DriverLicenseEntity, RefreshTokenEntity]),
  ],
  controllers: [AdminController],
  providers: [
    AdminService,
    RoleService,
    {
      provide: 'IUserRepository',
      useClass: UserRepository,
    },
    {
      provide: 'IUserProfileRepository',
      useClass: UserProfileRepository,
    },
    {
      provide: 'IDriverLicenseRepository',
      useClass: DriverLicenseRepository,
    },
    {
      provide: 'IRefreshTokenRepository',
      useClass: RefreshTokenRepository,
    },
    {
      provide: 'IUserRoleRepository',
      useClass: UserRoleRepository,
    },
    {
      provide: 'IRoleService',
      useClass: RoleService,
    },
  ],
  exports: [AdminService],
})
export class AdminModule {}