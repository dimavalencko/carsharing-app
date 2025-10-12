import { RefreshToken } from '@domain/entities';
import { PasswordHash } from '@domain/value-objects/password-hash.vo';
import { RefreshTokenEntity } from '../entities/refresh-token.entity';

export class RefreshTokenMapper {
  static toDomain(entity: RefreshTokenEntity): RefreshToken {
    return new RefreshToken(
      entity.id,
      entity.userId,
      new PasswordHash(entity.tokenHash),
      entity.expiresAt,
      entity.userAgent,
      entity.ipAddress,
      entity.isRevoked,
      entity.createdAt,
    );
  }

  static toPersistence(token: RefreshToken): RefreshTokenEntity {
    const entity = new RefreshTokenEntity();
    entity.id = token.id;
    entity.userId = token.userId;
    entity.tokenHash = token.tokenHash.getValue();
    entity.expiresAt = token.expiresAt;
    entity.userAgent = token.userAgent as string;
    entity.ipAddress = token.ipAddress as string;
    entity.isRevoked = token.isRevoked;
    entity.createdAt = token.createdAt;
    return entity;
  }
}