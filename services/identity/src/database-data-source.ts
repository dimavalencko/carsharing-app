import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { UserEntity } from './infrastructure/persistence/typeorm/entities/user.entity';
import { DriverLicenseEntity } from './infrastructure/persistence/typeorm/entities/driver-license.entity';
import { RefreshTokenEntity } from './infrastructure/persistence/typeorm/entities/refresh-token.entity';
import { config } from 'dotenv';

config({ path: `.env.${process.env.NODE_ENV || 'development'}` });

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'identity_db',
  entities: [UserEntity, DriverLicenseEntity, RefreshTokenEntity],
  migrations: ['dist/migrations/*.js'],
});

export default AppDataSource;
