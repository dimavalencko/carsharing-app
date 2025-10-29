import { Injectable, Inject } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import type { IUserRepository, IRefreshTokenRepository } from '@/domain/interfaces/repositories';
import type { IPasswordHasher, ITokenService } from '@/domain/interfaces/services';
import { LoginValue, PasswordValue, RefreshTokenValue } from '@/domain/value-objects';
import { User } from '@/domain/entities/user.entity';
import { UserAggregate } from '@/domain/aggregates/user';

@Injectable()
export class AuthFacadeService {
  constructor(
    @Inject('IUserRepository') private readonly users: IUserRepository,
    @Inject('IRefreshTokenRepository') private readonly refreshTokens: IRefreshTokenRepository,
    @Inject('IPasswordHasher') private readonly passwordHasher: IPasswordHasher,
    @Inject('ITokenService') private readonly tokenService: ITokenService,
  ) {}

  async register(dto: { login: string; password: string; firstName: string; lastName?: string }) {
    if (await this.users.existsByLogin(dto.login)) {
      throw new Error('Login already in use');
    }
    const hashed = await this.passwordHasher.hash(dto.password);
    const user = User.create({
      login: LoginValue.create(dto.login),
      password: PasswordValue.create(hashed),
      firstName: dto.firstName,
      lastName: dto.lastName,
    }, uuid());
    const aggregate = UserAggregate.create(user);
    await this.users.save(aggregate);

    const tokens = await this.tokenService.generateTokenPair({
      userId: user.getId(),
      login: user.getLogin().getValue(),
      role: user.getRole(),
    });
    return {
      userId: user.getId(),
      accessToken: tokens.accessToken.getValue(),
      refreshToken: tokens.refreshToken.getValue(),
    };
  }

  async login(dto: { login: string; password: string }) {
    const aggregate = await this.users.findByLogin(dto.login);
    if (!aggregate) throw new Error('Invalid credentials');
    const entity = aggregate.getUser();

    const ok = await this.passwordHasher.compare(
      dto.password,
      entity.getPassword().getValue()
    );
    if (!ok) throw new Error('Invalid credentials');

    const tokens = await this.tokenService.generateTokenPair({
      userId: entity.getId(),
      login: entity.getLogin().getValue(),
      role: entity.getRole(),
    });

    return {
      accessToken: tokens.accessToken.getValue(),
      refreshToken: tokens.refreshToken.getValue(),
    };
  }

  async refresh(refreshToken: string) {
    const payload = await this.tokenService.verifyRefreshToken(refreshToken);
    const tokens = await this.tokenService.generateTokenPair({
      userId: payload.getUserId(),
      login: payload.getLogin(),
      role: payload.getRole(),
    });
    return {
      accessToken: tokens.accessToken.getValue(),
      refreshToken: tokens.refreshToken.getValue(),
    };
  }

  async changePassword(userId: string, dto: { oldPassword: string; newPassword: string }) {
    const aggregate = await this.users.findById(userId);
    if (!aggregate) throw new Error('User not found');
    const user = aggregate.getUser();

    const match = await this.passwordHasher.compare(
      dto.oldPassword,
      user.getPassword().getValue()
    );
    if (!match) throw new Error('Old password mismatch');

    const newHash = await this.passwordHasher.hash(dto.newPassword);
    user.changePassword(PasswordValue.create(newHash));
    await this.users.save(aggregate);
  }

  async logout(userId: string, refreshToken?: string) {
    if (refreshToken) {
      const tokenEntity = await this.refreshTokens.findByToken(refreshToken);
      if (tokenEntity) {
        tokenEntity.revoke();
        await this.refreshTokens.save(tokenEntity);
      }
    } else {
      await this.refreshTokens.revokeByUserId(userId);
    }
  }

  async validateUser(login: string, password: string) {
    const aggregate = await this.users.findByLogin(login);
    if (!aggregate) return null;
    const user = aggregate.getUser();
    const ok = await this.passwordHasher.compare(password, user.getPassword().getValue());
    if (!ok) return null;
    return {
      id: user.getId(),
      login: user.getLogin().getValue(),
      role: user.getRole(),
    };
  }
}