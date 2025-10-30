import { RefreshToken } from '@/domain/entities/refresh-token.entity';
import { TransactionManager } from '@/infrastructure/persistence/typeorm/transaction/transaction-manager';
import { UnitOfWork } from '@/infrastructure/persistence/typeorm/transaction/unit-of-work';

export class RefreshTokenIssueService {
  constructor(private readonly txManager: TransactionManager) {}

  async issueToken(token: RefreshToken): Promise<void> {
    await this.txManager.execute(async ({ manager }) => {
      const uow = new UnitOfWork(manager);
      await uow.refreshTokens.save(token);
    });
  }

  async revokeAllTokensForUser(userId: string): Promise<void> {
    await this.txManager.execute(async ({ manager }) => {
      const uow = new UnitOfWork(manager);
      await uow.refreshTokens.revokeByUserId(userId);
    });
  }

  async rotateToken(
    oldTokenValue: string,
    newToken: RefreshToken,
  ): Promise<void> {
    await this.txManager.execute(async ({ manager }) => {
      const uow = new UnitOfWork(manager);

      // Отозвать старый
      await uow.refreshTokens.revokeByToken(oldTokenValue);

      // Сохранить новый
      await uow.refreshTokens.save(newToken);
    });
  }
}
