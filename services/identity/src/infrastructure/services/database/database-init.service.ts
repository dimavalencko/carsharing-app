// database-init.service.ts
import { Injectable, OnApplicationBootstrap, Logger } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { SeederService } from './seeder.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DatabaseInitService implements OnApplicationBootstrap {
  private readonly logger = new Logger(DatabaseInitService.name);

  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
    private seederService: SeederService,
    private configService: ConfigService
  ) {
    this.logger.log('DatabaseInitService constructor called');
  }

  async onApplicationBootstrap() {
    this.logger.log('onApplicationBootstrap called');
    
    try {
      console.log('🔍 Checking DataSource initialization...');
      console.log('🔍 DataSource isInitialized:', this.dataSource.isInitialized);
      
      // Если DataSource не инициализирована - инициализируем
      if (!this.dataSource.isInitialized) {
        console.log('🔍 Initializing DataSource...');
        await this.dataSource.initialize();
        console.log('🔍 DataSource initialized:', this.dataSource.isInitialized);
      }

      // Проверяем metadata после инициализации
      const entities = this.dataSource.entityMetadatas;
      console.log('🔍 Available entities after initialization:', entities.map(e => e.name));
      // Проверяем соединение
      await this.dataSource.query('SELECT 1');
      this.logger.log('✅ Database connection established');
      
      // Запуск миграций
      await this.runMigrations();
      
      // Засеивание данных
      await this.seedData();
      this.logger.log('✅ Data seeding completed');
      
      this.logger.log('✅ Database initialization completed');
    } catch (error) {
      this.logger.error('❌ Database initialization failed:', error);
      throw error;
    }
  }

  private async runMigrations() {
    try {
      // Проверяем, есть ли таблица миграций
      const migrationTableExists = await this.dataSource.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = 'migrations'
        )
      `);
      
      if (!migrationTableExists[0].exists) {
        this.logger.log('Running synchronize instead of migrations');
        await this.dataSource.synchronize();
        this.logger.log('✅ Synchronize completed');
      }
    } catch (error) {
      this.logger.warn('Migrations failed, trying to synchronize...');
      await this.dataSource.synchronize();
      this.logger.log('✅ Synchronize completed as fallback');
    }
  }

  private async seedData() {
    try {
      await this.seederService.seedAll();
      this.logger.log('✅ Data seeding completed');
    } catch (error) {
      this.logger.error('❌ Data seeding failed:', error);
    }
  }
}