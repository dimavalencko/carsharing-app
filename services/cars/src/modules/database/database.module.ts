import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { CarEntity } from '@/infrastructure/persistence/typeorm/entities/car.entity';
import { CarRepository } from '@/infrastructure/persistence/typeorm/repositories/car.repository';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'DATA_SOURCE_OPTIONS',
      useFactory: (config: ConfigService): DataSourceOptions => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST', 'localhost'),
        port: parseInt(config.get<string>('DB_PORT', '5432'), 10),
        username: config.get<string>('DB_USERNAME', 'postgres'),
        password: config.get<string>('DB_PASSWORD', 'root'),
        database: config.get<string>('DB_NAME', 'cars'),
        entities: [CarEntity],
        synchronize: config.get('NODE_ENV') !== 'production',
        logging: config.get('DB_LOGGING') === 'true',
      }),
      inject: [ConfigService],
    },
    {
      provide: DataSource,
      useFactory: async (options: DataSourceOptions) => {
        const dataSource = new DataSource(options);
        await dataSource.initialize();
        return dataSource;
      },
      inject: ['DATA_SOURCE_OPTIONS'],
    },
    {
      provide: 'ICarRepository',
      useFactory: (ds: DataSource) => new CarRepository(ds.getRepository(CarEntity)),
      inject: [DataSource],
    },
  ],
  exports: ['ICarRepository', DataSource],
})
export class DatabaseModule {}
