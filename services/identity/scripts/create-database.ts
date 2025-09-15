import { DataSource } from 'typeorm';
import { config } from 'dotenv';

config({ path: `.env.${process.env.NODE_ENV || 'development'}` });

export async function createDatabaseIfNotExists() {
  const dbName = process.env.DB_NAME;


  // Создаем DataSource для подключения к системной БД 'postgres'
  const adminDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT ?? '5432', 10),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: 'postgres',
  });

  try {
    await adminDataSource.initialize();
    
    // Проверяем, существует ли уже наша БД
    const result = await adminDataSource.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [dbName]
    );

    if (result.length === 0) {
      // Если нет - создаем ее
      await adminDataSource.query(`CREATE DATABASE ${dbName}`);
      console.log(`✅Database '${dbName}' created successfully.`);
    } 
    else {
      console.log(`Database '${dbName}' already exists.`);
    }
  } 
  catch (error) {
    console.error(`❌Error creating database '${dbName}':`, error.message);
    throw error;
  } 
  finally {
    // Закрываем соединение с системной БД
    if (adminDataSource.isInitialized) {
      await adminDataSource.destroy();
    }
  }
}