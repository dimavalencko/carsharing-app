import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { Logger } from '@nestjs/common';

config({ path: `.env.${process.env.NODE_ENV || 'development'}` });

const logger = new Logger('DatabaseCreator');

export async function createDatabaseIfNotExists() {
  const dbName = process.env.DB_NAME;

  if (!dbName) {
    throw new Error('DB_NAME environment variable is not set');
  }

  // Создаем DataSource для подключения к системной БД 'postgres'
  const adminDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: 'postgres',
  });

  try {
    await adminDataSource.initialize();
    logger.log('Connected to admin database');
    
    // Проверяем, существует ли уже наша БД
    const result = await adminDataSource.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [dbName]
    );

    if (result.length === 0) {
      // Если нет - создаем ее
      await adminDataSource.query(`CREATE DATABASE "${dbName}"`);
      logger.log(`✅ Database '${dbName}' created successfully`);
    } 
    else {
      logger.log(`Database '${dbName}' already exists`);
    }
  } 
  catch (error) {
  logger.error(`❌ Error creating database '${dbName}': ${error.message}`);
  } 
  finally {
    // Закрываем соединение с системной БД
    if (adminDataSource.isInitialized) {
      await adminDataSource.destroy();
      logger.log('Admin database connection closed');
    }
  }
}