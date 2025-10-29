import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';

import { UserEntity } from '@/infrastructure/persistence/typeorm/entities/user.entity';
import { DriverLicenseEntity } from '@/infrastructure/persistence/typeorm/entities/driver-license.entity';
import { RefreshTokenEntity } from '@/infrastructure/persistence/typeorm/entities/refresh-token.entity';

import { UserRepository } from '@/infrastructure/persistence/typeorm/repositories/user.repository';
import { DriverLicenseRepository } from '@/infrastructure/persistence/typeorm/repositories/driver-license.repository';
import { RefreshTokenRepository } from '@/infrastructure/persistence/typeorm/repositories/refresh-token.repository';

import { TransactionManager } from '@/infrastructure/persistence/typeorm/transaction/transaction-manager';
import { UserCreationService } from '@/infrastructure/services/user-creation.service';
import { SeederService } from '@/infrastructure/services/database/seeder.service';
import { DatabaseInitService } from '@/infrastructure/services/database/database-init.service';
import { createDatabaseIfNotExists } from '../../../scripts/create-database';
import { TokenService } from '@/infrastructure/services/token.service';
import { PasswordHasherService } from '@/infrastructure/services/password-hasher.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'DATA_SOURCE_OPTIONS',
      useFactory: async (config: ConfigService): Promise<DataSourceOptions> => {
        const isProd = config.get('NODE_ENV') === 'production';

        return {
          type: 'postgres',
          host: config.get<string>('DB_HOST', 'localhost'),
          port: parseInt(config.get<string>('DB_PORT', '5432'), 10),
          username: config.get<string>('DB_USER', 'postgres'),
          password: config.get<string>('DB_PASSWORD', 'postgres'),
          database: config.get<string>('DB_NAME', 'identity_db'),
          entities: [
            UserEntity,
            DriverLicenseEntity,
            RefreshTokenEntity,
          ],
          synchronize: !isProd,
          logging: config.get('DB_LOGGING') === 'true',
          migrations: ['dist/migrations/*.js'],
          migrationsRun: isProd,  // В проде автоматически прогоняем миграции
        };
      },
      inject: [ConfigService],
    },
    {
      provide: DataSource,
      useFactory: async (options: DataSourceOptions, config: ConfigService) => {
        // Создание базы если её нет (dev convenience)
        if (config.get('AUTO_CREATE_DB') === 'true') {
          try {
            await createDatabaseIfNotExists();
          } catch (e) {
            console.warn('Skipping DB create step:', e.message);
          }
        }
        const dataSource = new DataSource(options);
        await dataSource.initialize();
        return dataSource;
      },
      inject: ['DATA_SOURCE_OPTIONS', ConfigService],
    },

    // Транзакции
    {
      provide: 'TransactionManager',
      useFactory: (ds: DataSource) => new TransactionManager(ds),
      inject: [DataSource],
    },

    // Репозитории (DI адаптеры под интерфейсы domain слоя)
    {
      provide: 'IUserRepository',
      useFactory: (ds: DataSource) =>
        new UserRepository(ds.getRepository(UserEntity)),
      inject: [DataSource],
    },
    {
      provide: 'IDriverLicenseRepository',
      useFactory: (ds: DataSource) =>
        new DriverLicenseRepository(ds.getRepository(DriverLicenseEntity)),
      inject: [DataSource],
    },
    {
      provide: 'IRefreshTokenRepository',
      useFactory: (ds: DataSource) =>
        new RefreshTokenRepository(ds.getRepository(RefreshTokenEntity)),
      inject: [DataSource],
    },

    // Оркестрационные сервисы
    {
      provide: 'UserCreationService',
      useFactory: (tx: TransactionManager) =>
        new UserCreationService(tx),
      inject: ['TransactionManager'],
    },
    {
      provide: 'ITokenService',
      useClass: TokenService,
    },
    {
      provide: 'IPasswordHasher',
      useClass: PasswordHasherService,
    },

    // Seeder & init
    SeederService,
    DatabaseInitService,
  ],
  exports: [
    'IUserRepository',
    'IDriverLicenseRepository',
    'IRefreshTokenRepository',
    'TransactionManager',
    'UserCreationService',
    DataSource,
  ],
})
export class DatabaseModule { }