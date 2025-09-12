const { Client } = require('pg');
require('dotenv').config();

async function setupDatabase() {
  console.log('🔧 Setting up database for local development...');
  
  const config = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'root',
    database: 'postgres' // Подключаемся к основной БД сначала
  };

  const client = new Client(config);
  
  try {
    await client.connect();
    console.log('✅ Connected to PostgreSQL server');

    const targetDbName = process.env.DB_NAME || 'identity_db';
    
    // Проверяем существование базы данных
    const dbExists = await client.query(
      'SELECT 1 FROM pg_database WHERE datname = $1',
      [targetDbName]
    );

    if (dbExists.rows.length === 0) {
      console.log(`📦 Creating database: ${targetDbName}`);
      await client.query(`CREATE DATABASE ${targetDbName}`);
      console.log(`✅ Database ${targetDbName} created`);
    } else {
      console.log(`✅ Database ${targetDbName} already exists`);
    }

    // Теперь подключаемся к целевой БД и создаем таблицы
    const targetConfig = { ...config, database: targetDbName };
    const targetClient = new Client(targetConfig);
    await targetClient.connect();

    // Создаем таблицы если не существуют
    await targetClient.query(`
      CREATE EXTENSION IF NOT EXISTS "pgcrypto";
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
      
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('✅ Tables created/verified successfully');

    // Добавляем тестовые данные если нужно
    if (process.env.SEED_DATA === 'true') {
      await targetClient.query(`
        INSERT INTO users (id, email, password_hash, first_name, last_name) VALUES 
        ('11111111-1111-1111-1111-111111111111', 'admin@example.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin', 'User'),
        ('22222222-2222-2222-2222-222222222222', 'user@example.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'John', 'Doe')
        ON CONFLICT (id) DO NOTHING;
      `);
      console.log('✅ Test data inserted');
    }

    await targetClient.end();

  } catch (error) {
    console.error('❌ Database setup error:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 PostgreSQL is not running. Please start it:');
      console.log('   Option 1: Run with Docker: docker-compose up postgres');
      console.log('   Option 2: Install PostgreSQL locally and start the service');
    }
    
    process.exit(1);
  } finally {
    await client.end();
  }
}

// Запускаем setup только если скрипт вызван напрямую
if (require.main === module) {
  setupDatabase().catch(console.error);
}

module.exports = { setupDatabase };