import { Module } from '@nestjs/common';
import { MicroservicesModule } from '../microservices.module';
import { AuthController } from './controllers/auth.controller';
import { UsersController } from './controllers/users.controller';
import { AdminController } from './controllers/admin.controller';
import { DriverLicenseController } from './controllers/driver-license.controller';
import { HealthController } from './controllers/health.controller';
import { JwtAuthGuard, AdminGuard } from '@src/guards';
import { IdentityProxy } from './proxy/identity.proxy';

@Module({
  imports: [MicroservicesModule],
  controllers: [
    AuthController,
    UsersController,
    AdminController,
    DriverLicenseController,
    HealthController,
  ],
  providers: [
    IdentityProxy,
    JwtAuthGuard,
    AdminGuard,
  ],
  exports: [
    IdentityProxy,
    JwtAuthGuard,
    AdminGuard,
  ],
})
export class IdentityModule {}