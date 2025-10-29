import { RefreshToken } from '@/domain/entities/refresh-token.entity';
import { RefreshTokenEntity } from '../entities/refresh-token.entity';

export class RefreshTokenMapper {
  static toPersistence(token: RefreshToken): RefreshTokenEntity {
    const entity = new RefreshTokenEntity();
    entity.id = token.getId();
    entity.userId = token.getUserId();
    entity.token = token.getToken();
    entity.expiresAt = token.getExpiresAt();
    entity.createdAt = token.getCreatedAt();
    entity.revokedAt = token.getRevokedAt();
    return entity;
  }

  static toDomain(entity: RefreshTokenEntity): RefreshToken {
    return RefreshToken.reconstitute(entity.id, {
      userId: entity.userId,
      token: entity.token,
      expiresAt: entity.expiresAt,
      createdAt: entity.createdAt,
      revokedAt: entity.revokedAt,
    });
  }
}