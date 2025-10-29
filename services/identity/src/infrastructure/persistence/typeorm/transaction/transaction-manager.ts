import { DataSource, EntityManager } from 'typeorm';

// Позволяет выполнять произвольный блок кода в рамках одной БД-транзакции.
export class TransactionManager {
  constructor(private readonly dataSource: DataSource) {}

  async execute<T>(
    work: (ctx: { manager: EntityManager }) => Promise<T>,
  ): Promise<T> {
    return this.dataSource.transaction(async (manager) => {
      return work({ manager });
    });
  }
}
