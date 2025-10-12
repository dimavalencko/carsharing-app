import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from '@infrastructure/controllers/auth.controller';
import { AuthService } from '@infrastructure/services/auth.service';
import { UserRepository } from '@infrastructure/repositories/user.repository';
import { DriverLicenseEntity, RefreshTokenEntity, UserEntity, UserRoleEntity } from '@/infrastructure/persistence/typeorm';
import { DriverLicenseRepository } from '@/infrastructure/repositories/driver-license.repository';
import { RefreshTokenRepository } from '@/infrastructure/repositories/refresh-token.repository';
import { UserRoleRepository } from '@/infrastructure/repositories/user-role.repository';
import { PasswordHasherService } from '@/infrastructure/services/password-hasher.service';
import { RoleService } from '@/infrastructure/services/roles.service';
import { TokenService } from '@/infrastructure/services/token.service';


@Module({
  imports: [
    TypeOrmModule.forFeature([UserRoleEntity, UserEntity, RefreshTokenEntity, DriverLicenseEntity]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secret',
      signOptions: { expiresIn: '15m' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    TokenService,
    PasswordHasherService,
    RoleService,
    {
      provide: 'IUserRepository',
      useClass: UserRepository,
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
      provide: 'IDriverLicenseRepository',
      useClass: DriverLicenseRepository,
    },
    {
      provide: 'IPasswordHasher',
      useClass: PasswordHasherService,
    },
    {
      provide: 'ITokenService',
      useClass: TokenService,
    },
    {
      provide: 'IRoleService',
      useClass: RoleService,
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}