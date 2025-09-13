import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../domain/entities/user.entity';

@Injectable()
export class HealthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async checkHealth() {
    return {
      status: 'healthy',
      service: 'identity',
      timestamp: new Date().toISOString(),
    };
  }

  async checkDatabase() {
    try {
      // Простой запрос для проверки подключения
      await this.usersRepository.query('SELECT 1');
      return {
        database: 'connected',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        database: 'disconnected',
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }
}