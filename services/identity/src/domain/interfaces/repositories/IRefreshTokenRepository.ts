import { RefreshToken } from '@/domain/entities';

export interface IRefreshTokenRepository {
  findByToken(token: string): Promise<RefreshToken | null>;
  findByUserId(userId: string): Promise<RefreshToken[]>;
  save(refreshToken: RefreshToken): Promise<void>;
  revokeByUserId(userId: string): Promise<void>;
  revokeByToken(token: string): Promise<void>;
  deleteExpiredTokens(): Promise<void>;
}
