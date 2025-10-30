import { Repository, LessThan, IsNull } from 'typeorm';
import { IRefreshTokenRepository } from '@/domain/interfaces/repositories';
import { RefreshToken } from '@/domain/entities/refresh-token.entity';
import { RefreshTokenEntity } from '../entities/refresh-token.entity';
import { RefreshTokenMapper } from '../mappers/refresh-token.mapper';

export class RefreshTokenRepository implements IRefreshTokenRepository {
  constructor(private readonly ormRepo: Repository<RefreshTokenEntity>) {}

  async findByToken(token: string): Promise<RefreshToken | null> {
    const entity = await this.ormRepo.findOne({ where: { token } });
    return entity ? RefreshTokenMapper.toDomain(entity) : null;
  }

  async findByUserId(userId: string): Promise<RefreshToken[]> {
    const entities = await this.ormRepo.find({ where: { userId } });
    return entities.map((e) => RefreshTokenMapper.toDomain(e));
  }

  async save(refreshToken: RefreshToken): Promise<void> {
    const entity = RefreshTokenMapper.toPersistence(refreshToken);
    await this.ormRepo.save(entity);
  }

  async revokeByUserId(userId: string): Promise<void> {
    const tokens = await this.ormRepo.find({
      where: { userId, revokedAt: IsNull() },
    });
    for (const token of tokens) {
      token.revokedAt = new Date();
      await this.ormRepo.save(token);
    }
  }

  async revokeByToken(token: string): Promise<void> {
    const entity = await this.ormRepo.findOne({
      where: { token, revokedAt: IsNull() },
    });
    if (entity) {
      entity.revokedAt = new Date();
      await this.ormRepo.save(entity);
    }
  }

  async deleteExpiredTokens(): Promise<void> {
    await this.ormRepo.delete({ expiresAt: LessThan(new Date()) });
  }
}
