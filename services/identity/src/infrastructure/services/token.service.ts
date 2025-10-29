import { Injectable } from '@nestjs/common';
import { ITokenService } from '@/domain/interfaces/services/ITokenService';
import {
  JwtPayloadValue,
  AccessTokenValue,
  RefreshTokenValue,
} from '@/domain/value-objects';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';

interface DecodedJwtPayload {
  sub: string;
  login: string;
  role: string;
  exp?: number;
  iat?: number;
}

function verifyToken(token: string, secret: string): DecodedJwtPayload {
  const raw: unknown = jwt.verify(token, secret);
  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) {
    throw new Error('Invalid token payload');
  }
  const obj = raw as Record<string, unknown>;
  const sub = obj.sub;
  const login = obj.login;
  const role = obj.role;
  if (
    typeof sub !== 'string' ||
    typeof login !== 'string' ||
    typeof role !== 'string'
  ) {
    throw new Error('Missing required token claims');
  }
  const expVal = obj.exp;
  const iatVal = obj.iat;
  const exp = typeof expVal === 'number' ? expVal : undefined;
  const iat = typeof iatVal === 'number' ? iatVal : undefined;
  return { sub, login, role, exp, iat };
}

function parseDuration(raw: string): number {
  // Форматы: 15m, 30d, 1h, 45s или просто число (секунды)
  const match = /^\s*(\d+)\s*([smhd])?\s*$/i.exec(raw);
  if (!match) {
    const direct = Number(raw);
    return Number.isFinite(direct) ? direct : 0;
  }
  const value = parseInt(match[1], 10);
  const unit = (match[2] || 's').toLowerCase();
  switch (unit) {
    case 's':
      return value;
    case 'm':
      return value * 60;
    case 'h':
      return value * 3600;
    case 'd':
      return value * 86400;
    default:
      return value;
  }
}

@Injectable()
export class TokenService implements ITokenService {
  constructor(private readonly config: ConfigService) {}

  generateTokenPair(payload: {
    userId: string;
    login: string;
    role: string;
  }): Promise<{
    accessToken: AccessTokenValue;
    refreshToken: RefreshTokenValue;
  }> {
    const accessSecret: string = this.config.get<string>(
      'JWT_ACCESS_SECRET',
      'access-secret',
    );
    const refreshSecret: string = this.config.get<string>(
      'JWT_REFRESH_SECRET',
      'refresh-secret',
    );
    const accessTtlRaw: string = this.config.get('JWT_ACCESS_TTL', '15m');
    const refreshTtlRaw: string = this.config.get('JWT_REFRESH_TTL', '30d');
    const accessTtl = parseDuration(accessTtlRaw) || 900; // 15m по умолчанию
    const refreshTtl = parseDuration(refreshTtlRaw) || 2592000; // 30d по умолчанию

    const accessPayload = {
      sub: payload.userId,
      login: payload.login,
      role: payload.role,
    } as const;
    const access: string = jwt.sign(accessPayload, accessSecret, {
      expiresIn: accessTtl,
    });
    const refreshPayload = {
      sub: payload.userId,
      login: payload.login,
      role: payload.role,
    } as const;
    const refresh: string = jwt.sign(refreshPayload, refreshSecret, {
      expiresIn: refreshTtl,
    });

    return Promise.resolve({
      accessToken: AccessTokenValue.create(access),
      refreshToken: RefreshTokenValue.create(refresh),
    });
  }

  verifyAccessToken(token: string): Promise<JwtPayloadValue> {
    const accessSecret = this.config.get<string>(
      'JWT_ACCESS_SECRET',
      'access-secret',
    );
    const decoded = verifyToken(token, accessSecret);
    return Promise.resolve(
      JwtPayloadValue.create({
        userId: decoded.sub,
        login: decoded.login,
        role: decoded.role,
        exp: decoded.exp,
        iat: decoded.iat,
      }),
    );
  }

  verifyRefreshToken(token: string): Promise<JwtPayloadValue> {
    const refreshSecret = this.config.get<string>(
      'JWT_REFRESH_SECRET',
      'refresh-secret',
    );
    const decoded = verifyToken(token, refreshSecret);
    return Promise.resolve(
      JwtPayloadValue.create({
        userId: decoded.sub,
        login: decoded.login,
        role: decoded.role,
        exp: decoded.exp,
        iat: decoded.iat,
      }),
    );
  }
}
