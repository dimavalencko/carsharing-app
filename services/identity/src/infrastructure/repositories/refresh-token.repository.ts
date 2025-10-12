import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan  } from 'typeorm';
import { IRefreshTokenRepository } from '@domain/interfaces/repositories';
import { RefreshToken } from '@domain/entities';
import { RefreshTokenEntity } from '../persistence/typeorm/entities';
import { PasswordHash } from '@/domain/value-objects/password-hash.vo';
import { RefreshTokenMapper } from '../persistence/typeorm/mappers';


@Injectable()
export class RefreshTokenRepository implements IRefreshTokenRepository {
  constructor(
    @InjectRepository(RefreshTokenEntity)
    private readonly repository: Repository<RefreshTokenEntity>,
  ) {}

  async findByTokenHash(tokenHash: PasswordHash): Promise<RefreshToken | null> {
    const entity = await this.repository.findOne({ 
      where: { tokenHash: tokenHash.getValue() }
    });
    return entity ? RefreshTokenMapper.toDomain(entity) : null;
  }

  async findByUserId(userId: string): Promise<RefreshToken[]> {
    const entities = await this.repository.find({ 
      where: { userId },
      order: { createdAt: 'DESC' }
    });
    return entities.map(entity => RefreshTokenMapper.toDomain(entity));
  }

  async save(token: RefreshToken): Promise<RefreshToken> {
    const entity = RefreshTokenMapper.toPersistence(token);
    const savedEntity = await this.repository.save(entity);
    return RefreshTokenMapper.toDomain(savedEntity);
  }

  async revokeAllForUser(userId: string): Promise<void> {
    await this.repository.update(
      { userId, isRevoked: false },
      { isRevoked: true }
    );
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async deleteExpired(): Promise<void> {
    await this.repository.delete({
      expiresAt: LessThan(new Date())
    });
  }
}