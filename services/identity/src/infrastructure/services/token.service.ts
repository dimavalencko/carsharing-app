import { Injectable } from '@nestjs/common';
import { ITokenService } from '@/domain/interfaces/services/ITokenService';
import { JwtPayloadValue, AccessTokenValue, RefreshTokenValue } from '@/domain/value-objects';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class TokenService implements ITokenService {
  constructor(private readonly config: ConfigService) {}

  async generateTokenPair(payload: { userId: string; login: string; role: string }) {
    const accessSecret = this.config.get<string>('JWT_ACCESS_SECRET', 'access-secret');
    const refreshSecret = this.config.get<string>('JWT_REFRESH_SECRET', 'refresh-secret');
    const accessTtl = this.config.get('JWT_ACCESS_TTL', '15m');
    const refreshTtl = this.config.get('JWT_REFRESH_TTL', '30d');

    const access = jwt.sign(
      { sub: payload.userId, login: payload.login, role: payload.role },
      accessSecret,
      { expiresIn: accessTtl }
    );
    const refresh = jwt.sign(
      { sub: payload.userId, login: payload.login, role: payload.role },
      refreshSecret,
      { expiresIn: refreshTtl }
    );

    return {
      accessToken: AccessTokenValue.create(access),
      refreshToken: RefreshTokenValue.create(refresh),
    };
  }

  async verifyAccessToken(token: string): Promise<JwtPayloadValue> {
    const accessSecret = this.config.get<string>('JWT_ACCESS_SECRET', 'access-secret');
    const decoded = jwt.verify(token, accessSecret) as any;
    return JwtPayloadValue.create({
      userId: decoded.sub,
      login: decoded.login,
      role: decoded.role,
      exp: decoded.exp,
      iat: decoded.iat,
    });
  }

  async verifyRefreshToken(token: string): Promise<JwtPayloadValue> {
    const refreshSecret = this.config.get<string>('JWT_REFRESH_SECRET', 'refresh-secret');
    const decoded = jwt.verify(token, refreshSecret) as any;
    return JwtPayloadValue.create({
      userId: decoded.sub,
      login: decoded.login,
      role: decoded.role,
      exp: decoded.exp,
      iat: decoded.iat,
    });
  }
}