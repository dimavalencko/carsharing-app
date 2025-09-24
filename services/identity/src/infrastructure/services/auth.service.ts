import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IAuthService } from '../interfaces/IAuthService';
import { User, RefreshToken } from '@domain/entities';
import { TokensDto } from '@app/dto/auth/tokens.dto';
import type { IUserRepository } from '@domain/interfaces/IUserRepository';
import { CreateUserDto, UserRole } from '@carsharing/common';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userRepository.findByEmail(email);
    
    if (user && await user.validatePassword(password)) {
      return user;
    }
    
    throw new UnauthorizedException('Invalid credentials');
  }

  async login(user: User, userAgent?: string, ipAddress?: string): Promise<TokensDto> {
    const payload = { 
      email: user.email, 
      sub: user.id,
      role: user.role.name,
      firstName: user.profile.firstName,
      lastName: user.profile.lastName
    };

    const tokens = {
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload, { expiresIn: '7d' }),
    };

    // Создаем и сохраняем refresh token
    const refreshTokenEntity = RefreshToken.create(
      await this.hashToken(tokens.refreshToken),
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 дней
      user,
      userAgent,
      ipAddress
    );

    user.addRefreshToken(refreshTokenEntity);
    await this.userRepository.save(user);

    return tokens;
  }

  // async register(registerData: CreateUserDto): Promise<TokensDto> {
  //   const payload = { 
  //     email: registerData.email, 
  //     role: UserRole.User,
  //     firstName: registerData.firstName,
  //     lastName: registerData.lastName
  //   };

  //   const tokens = {
  //     accessToken: this.jwtService.sign(payload),
  //     refreshToken: this.jwtService.sign(payload, { expiresIn: '7d' }),
  //   };

  //   // Создаем и сохраняем refresh token
  //   const refreshTokenEntity = RefreshToken.create(
  //     await this.hashToken(tokens.refreshToken),
  //     new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 дней
  //     registerData,
  //   );

  //   user.addRefreshToken(refreshTokenEntity);
  //   await this.userRepository.save(user);

  //   return tokens;
  // }

  async refreshToken(refreshToken: string, userAgent?: string, ipAddress?: string): Promise<TokensDto> {
    try {
      const payload = this.jwtService.verify(refreshToken);
      const user = await this.userRepository.getById(payload.sub);

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // Ищем валидный refresh token
      const tokenHash = await this.hashToken(refreshToken);
      const validToken = user.refreshTokens.find(
        token => token.tokenHash=== tokenHash && token.isValid()
      );

      if (!validToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Отзываем старый токен
      validToken.revoke();

      // Создаем новые токены
      const newPayload = { 
        email: user.email, 
        sub: user.id,
        role: user.role.name,
        firstName: user.profile.firstName,
        lastName: user.profile.lastName
      };

      const tokens = {
        accessToken: this.jwtService.sign(newPayload),
        refreshToken: this.jwtService.sign(newPayload, { expiresIn: '7d' }),
      };

      // Создаем новый refresh token
      const newRefreshTokenEntity = RefreshToken.create(
        await this.hashToken(tokens.refreshToken),
        new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        user,
        userAgent,
        ipAddress
      );

      user.addRefreshToken(newRefreshTokenEntity);
      await this.userRepository.save(user);

      return tokens;
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(userId: string): Promise<void> {
    const user = await this.userRepository.getById(userId);

    if(!user) return;

    user.revokeAllRefreshTokens();
    await this.userRepository.save(user);
  }

  private async hashToken(token: string): Promise<string> {
    const bcrypt = await import('bcrypt');
    return bcrypt.hash(token, 10);
  }
}