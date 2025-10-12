import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ITokenService, JwtPayload } from '@domain/interfaces/services';
import { randomUUID } from 'crypto';


@Injectable()
export class TokenService implements ITokenService {
  constructor(private readonly jwtService: JwtService) {}

  generateAccessToken(payload: JwtPayload): string {
    return this.jwtService.sign(payload, { expiresIn: '15m' }); // Добавляем expiration
  }

  generateRefreshToken(): string {
    return randomUUID();
  }

  verifyAccessToken(token: string): JwtPayload {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  verifyRefreshToken(token: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(token);
  }

  decodeToken(token: string): JwtPayload | null {
    try {
      return this.jwtService.decode(token) as JwtPayload;
    } catch {
      return null;
    }
  }

  getTokenExpiration(token: string): Date | null {
    try {
      const decoded = this.jwtService.verify(token);
      if (decoded && decoded.exp) {
        return new Date(decoded.exp * 1000);
      }
      return null;
    } catch {
      return null;
    }
  }
}