import { UserRoles } from "@carsharing/common";
import { AccessTokenValue, JwtPayloadValue, RefreshTokenValue } from "@/domain/value-objects";

export interface ITokenService {
  generateTokenPair(payload: { 
    userId: string; 
    login: string; 
    role: UserRoles 
  }): Promise<{
    accessToken: AccessTokenValue;
    refreshToken: RefreshTokenValue;
  }>;
  verifyAccessToken(token: string): Promise<JwtPayloadValue>;
  verifyRefreshToken(token: string): Promise<JwtPayloadValue>;
}