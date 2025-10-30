import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '../database/database.module';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { HealthModule } from '../health/health.module';
import { AdminModule } from '../admin/admin.module';
import { DriverLicenseModule } from '../driver-license/driver-license.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),
    DatabaseModule,
    AuthModule,
    UsersModule,
    HealthModule,
    AdminModule,
    DriverLicenseModule,
  ],
})
export class AppModule {}
