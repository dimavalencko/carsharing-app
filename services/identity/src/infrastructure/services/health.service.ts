import { Injectable, Inject } from '@nestjs/common';
import { DataSource } from 'typeorm';
import type { IUserRepository } from '@/domain/interfaces/repositories';

@Injectable()
export class HealthService {
  constructor(
    private readonly dataSource: DataSource,
    @Inject('IUserRepository') private readonly users: IUserRepository,
  ) {}

  async checkHealth() {
    return {
      status: 'ok',
      service: 'identity',
      timestamp: new Date().toISOString(),
    };
  }

  async checkDatabase() {
    const result: any = {
      timestamp: new Date().toISOString(),
    };
    try {
      await this.dataSource.query('SELECT 1');
      result.database = 'connected';
      // Дополнительно можно проверить число пользователей
      const count = (await this.users.findAll()).length;
      result.usersCount = count;
    } catch (e: any) {
      result.database = 'disconnected';
      result.error = e.message;
    }
    return result;
  }
}