import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from '@infrastructure/controllers/users.controller';
import { UserService } from '@/infrastructure/services/user.service';
import { UserRepository } from '@/infrastructure/repositories/user.repository';
import { UserEntity, UserProfileEntity, UserRoleEntity, DriverLicenseEntity } from '@/infrastructure/persistence/typeorm';
import { DriverLicenseRepository } from '@/infrastructure/repositories/driver-license.repository';
import { UserProfileRepository } from '@/infrastructure/repositories/user-profile.repository';
import { UserRoleRepository } from '@/infrastructure/repositories/user-role.repository';
import { RoleService } from '@/infrastructure/services/roles.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRoleEntity, UserEntity, UserProfileEntity, DriverLicenseEntity]),
  ],
  controllers: [UsersController],
  providers: [
    UserService,
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
      provide: 'IUserRoleRepository',
      useClass: UserRoleRepository,
    },
    {
      provide: 'IDriverLicenseRepository',
      useClass: DriverLicenseRepository,
    },
    {
      provide: 'IRoleService',
      useClass: RoleService,
    },
  ],
  exports: [UserService],
})
export class UsersModule {}