// database.module.ts
import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseInitService } from '@infrastructure/services/database/database-init.service';
import { SeederService } from '@infrastructure/services/database/seeder.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User, RefreshToken, DriverLicense, Profile, Role } from '@domain/entities';
import { createDatabaseIfNotExists } from 'scripts/create-database';

@Global() // Делаем модуль глобальным
@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        // Создаем базу данных перед подключением
        await createDatabaseIfNotExists();
        
        return {
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
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [DatabaseInitService, SeederService],
  exports: [TypeOrmModule]
})
export class DatabaseModule {}