import { Injectable, Inject, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import type { IAuthService, IRoleService, IPasswordHasher, ITokenService } from '@domain/interfaces/services';
import type { IUserRepository, IRefreshTokenRepository, IDriverLicenseRepository } from '@domain/interfaces/repositories';
import { RegisterDto, LoginDto, ChangePasswordDto, AuthResponseDto, TokensDto } from '@carsharing/common';
import { User } from 'src/domain/entities/user.entity';
import { Email } from 'src/domain/value-objects/email.vo';
import { PasswordHash } from 'src/domain/value-objects/password-hash.vo';
import { RefreshToken } from 'src/domain/entities/refresh-token.entity';
import { randomUUID } from 'crypto';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @Inject('IUserRepository') private readonly userRepository: IUserRepository,
    @Inject('IRefreshTokenRepository') private readonly refreshTokenRepository: IRefreshTokenRepository,
    @Inject('IRoleService') private readonly roleService: IRoleService,
    @Inject('IDriverLicenseRepository') private readonly driverLicenseRepository: IDriverLicenseRepository,
    @Inject('IPasswordHasher') private readonly passwordHasher: IPasswordHasher,
    @Inject('ITokenService') private readonly tokenService: ITokenService,
  ) {}

  async register(dto: RegisterDto): Promise<AuthResponseDto> {
    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(new Email(dto.email));
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Get default user role
    const userRole = await this.roleService.getRoleByName('User');
    if (!userRole) {
      throw new Error('Default user role not found');
    }

    const user = new User(
      randomUUID(),
      new Email(dto.email),
      new PasswordHash(await this.passwordHasher.hash(dto.password)),
      dto.firstName,
      dto.lastName,
      dto.dateOfBirth,
      userRole.id,
      dto.phone || null,
      dto.patronymic || null,
    );

    const savedUser = await this.userRepository.save(user);
    return this.generateAuthResponse(savedUser);
  }

  async login(dto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.validateUser(dto.email, dto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const domainUser = await this.userRepository.getById(user.id);
    if (!domainUser) {
      throw new UnauthorizedException('User not found');
    }

    domainUser.markAsLoggedIn();
    await this.userRepository.save(domainUser);

    return this.generateAuthResponse(domainUser);
  }

  async logout(userId: string, refreshToken?: string): Promise<void> {
    if (refreshToken) {
      const tokenHash = new PasswordHash(await this.passwordHasher.hash(refreshToken));
      const storedToken = await this.refreshTokenRepository.findByTokenHash(tokenHash);
      
      if (storedToken) {
        storedToken.revoke();
        await this.refreshTokenRepository.save(storedToken);
      }
    } else {
      await this.refreshTokenRepository.revokeAllForUser(userId);
    }
  }

  async refreshTokens(refreshToken: string): Promise<TokensDto> {
    const tokenHash = new PasswordHash(await this.passwordHasher.hash(refreshToken));
    const storedToken = await this.refreshTokenRepository.findByTokenHash(tokenHash);
    
    if (!storedToken || !storedToken.isValid()) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.userRepository.getById(storedToken.userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    storedToken.revoke();
    await this.refreshTokenRepository.save(storedToken);

    const newRefreshToken = randomUUID();
    const newRefreshTokenEntity = new RefreshToken(
      randomUUID(),
      user.id,
      new PasswordHash(await this.passwordHasher.hash(newRefreshToken)),
      new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    );

    await this.refreshTokenRepository.save(newRefreshTokenEntity);

    const role = await this.roleService.getUserRole(user.id);
    const hasDriverLicense = await this.driverLicenseRepository.existsForUser(user.id);

    const accessToken = this.tokenService.generateAccessToken({
      sub: user.id,
      email: user.email.getValue(),
      role: role.name,
      hasDriverLicense,
    });

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  }

  async validateUser(email: string, password: string): Promise<{ id: string; role: string } | null> {
    const user = await this.userRepository.findByEmail(new Email(email));
    if (!user) {
      return null;
    }

    const isValid = await this.passwordHasher.verify(password, user.passwordHash.getValue());
    if (!isValid) {
      return null;
    }

    const role = await this.roleService.getUserRole(user.id);
    return {
      id: user.id,
      role: role.name,
    };
  }

  async changePassword(userId: string, dto: ChangePasswordDto): Promise<void> {
    const user = await this.userRepository.getById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isOldPasswordValid = await this.passwordHasher.verify(dto.oldPassword, user.passwordHash.getValue());
    if (!isOldPasswordValid) {
      throw new BadRequestException('Old password is incorrect');
    }

    const newPasswordHash = new PasswordHash(await this.passwordHasher.hash(dto.newPassword));
    user.changePassword(newPasswordHash);
    await this.userRepository.save(user);

    await this.refreshTokenRepository.revokeAllForUser(userId);
  }

  async revokeAllUserSessions(userId: string): Promise<void> {
    await this.refreshTokenRepository.revokeAllForUser(userId);
  }

  private async generateAuthResponse(user: User): Promise<AuthResponseDto> {
    const role = await this.roleService.getUserRole(user.id);
    const hasDriverLicense = await this.driverLicenseRepository.existsForUser(user.id);

    const accessToken = this.tokenService.generateAccessToken({
      sub: user.id,
      email: user.email.getValue(),
      role: role.name,
      hasDriverLicense,
    });

    const refreshToken = randomUUID();
    
    const refreshTokenEntity = new RefreshToken(
      randomUUID(),
      user.id,
      new PasswordHash(await this.passwordHasher.hash(refreshToken)),
      new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    );

    await this.refreshTokenRepository.save(refreshTokenEntity);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email.getValue(),
        firstName: user.firstName,
        lastName: user.lastName,
        role: role.name,
        hasDriverLicense,
      },
    };
  }
}