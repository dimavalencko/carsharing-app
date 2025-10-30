import { Injectable, Inject } from '@nestjs/common';
import { DataSource } from 'typeorm';
import type { IUserRepository } from '@/domain/interfaces/repositories';

export interface HealthStatus {
  status: string;
  service: string;
  timestamp: string;
}

export interface HealthDbStatus extends HealthStatus {
  database: 'connected' | 'disconnected';
  usersCount?: number;
  error?: string;
}

@Injectable()
export class HealthService {
  constructor(
    private readonly dataSource: DataSource,
    @Inject('IUserRepository') private readonly users: IUserRepository,
  ) {}

  checkHealth(): HealthStatus {
    return {
      status: 'ok',
      service: 'identity',
      timestamp: new Date().toISOString(),
    };
  }

  async checkDatabase(): Promise<HealthDbStatus> {
    const result: HealthDbStatus = {
      status: 'ok',
      service: 'identity',
      timestamp: new Date().toISOString(),
      database: 'disconnected',
    };
    try {
      await this.dataSource.query('SELECT 1');
      result.database = 'connected';
      // Дополнительно можно проверить число пользователей
      const count = (await this.users.findAll()).length;
      result.usersCount = count;
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Unknown error';
      result.database = 'disconnected';
      result.error = message;
    }
    return result;
  }
}
