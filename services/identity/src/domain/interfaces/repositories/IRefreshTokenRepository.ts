import { RefreshToken } from "@/domain/entities";
import { PasswordHash } from "@/domain/value-objects/password-hash.vo";

export interface IRefreshTokenRepository {
  findByTokenHash(tokenHash: PasswordHash): Promise<RefreshToken | null>;
  findByUserId(userId: string): Promise<RefreshToken[]>;
  save(token: RefreshToken): Promise<RefreshToken>;
  delete(id: string): Promise<void>;
  revokeAllForUser(userId: string): Promise<void>;
  deleteExpired(): Promise<void>;
}