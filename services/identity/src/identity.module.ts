import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { IdentityController } from './identity.controller';
import { IdentityService } from './identity.service';
import { HealthController } from './health/health.controller';
import { HealthService } from './health/health.service';

import{ User, DriverLicense, Profile, Role, RefreshToken } from './domain/entities'
import { seedRoles } from 'scripts/seeds/roles-seed';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [User, Role, DriverLicense, Profile, RefreshToken],
        synchronize: configService.get('NODE_ENV') !== 'production',
        logging: configService.get('NODE_ENV') === 'development',
        retryAttempts: 5,
        retryDelay: 3000,
        autoLoadEntities: true,
        // migrations: configService.get('NODE_ENV') === 'production' ? ['dist/migrations/*.js'] : [],
        // migrationsRun: configService.get('NODE_ENV') === 'production',
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([User, Role, DriverLicense, Profile, RefreshToken]),
  ],
  controllers: [IdentityController, HealthController],
  providers: [IdentityService, HealthService, User, Role, DriverLicense, Profile, RefreshToken],
})

export class IdentityModule {
  constructor(private dataSource: DataSource) {}

  async onApplicationBootstrap() {
    // Этот метод запустится, когда приложение полностью инициализируется
    // и подключится к БД. Выполняем заполнение бд данными.
    await seedRoles(this.dataSource);
  }
}