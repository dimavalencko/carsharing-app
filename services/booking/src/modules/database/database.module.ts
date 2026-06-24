import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { BookingEntity } from '@/infrastructure/persistence/typeorm/entities/booking.entity';
import { BookingRepository } from '@/infrastructure/persistence/typeorm/repositories/booking.repository';
import { BookingSeederService } from '@/infrastructure/services/database/seeder.service';

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
        password: config.get<string>('DB_PASSWORD', 'postgres'),
        database: config.get<string>('DB_NAME', 'booking'),
        entities: [BookingEntity],
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
      provide: 'IBookingRepository',
      useFactory: (ds: DataSource) =>
        new BookingRepository(ds.getRepository(BookingEntity)),
      inject: [DataSource],
    },
    BookingSeederService,
  ],
  exports: ['IBookingRepository', DataSource],
})
export class DatabaseModule {}
