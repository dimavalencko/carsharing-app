import { v4 as uuidv4 } from 'uuid';
import { RefreshToken, User } from "../entities";
import { IRefreshTokenRepository, IUserRepository } from "../interfaces/repositories";
import { IPasswordHasher, ITokenService } from "../interfaces/services";
import { AccessTokenValue, RefreshTokenValue } from "../value-objects";

export interface TokenPair {
  accessToken: AccessTokenValue;
  refreshToken: RefreshTokenValue;
}

export interface LoginCommand {
  login: string;
  password: string;
}

export interface RefreshCommand {
  refreshToken: string;
}

export class AuthService {
  constructor(
    private userRepository: IUserRepository,
    private refreshTokenRepository: IRefreshTokenRepository,
    private tokenService: ITokenService,
    private passwordHasher: IPasswordHasher
  ) {}

  async login(command: LoginCommand): Promise<TokenPair> {
    const userAggregate = await this.userRepository.findByLogin(command.login);
    
    if (!userAggregate) {
      throw new Error('Invalid credentials');
    }

    const user = userAggregate.getUser();
    
    const passwordValid = await this.passwordHasher.compare(
      command.password, 
      user.getPassword().getValue()
    );

    if (!passwordValid) {
      throw new Error('Invalid credentials');
    }

    const tokenPair = await this.generateUserTokens(user);
    return tokenPair;
  }

  async refresh(command: RefreshCommand): Promise<TokenPair> {
    const payload = await this.tokenService.verifyRefreshToken(command.refreshToken);
    
    const refreshTokenEntity = await this.refreshTokenRepository.findByToken(command.refreshToken);
    
    if (!refreshTokenEntity || !refreshTokenEntity.isValid()) {
      throw new Error('Invalid refresh token');
    }

    const userAggregate = await this.userRepository.findById(payload.getUserId());
    if (!userAggregate) {
      throw new Error('User not found');
    }

    const user = userAggregate.getUser();

    await this.revokeRefreshToken(refreshTokenEntity);

    const tokenPair = await this.generateUserTokens(user);
    return tokenPair;
  }

  async logout(refreshToken: string): Promise<void> {
    await this.refreshTokenRepository.revokeByToken(refreshToken);
  }

  async logoutAll(userId: string): Promise<void> {
    await this.refreshTokenRepository.revokeByUserId(userId);
  }

  private async generateUserTokens(user: User): Promise<TokenPair> {
    const tokenPair = await this.tokenService.generateTokenPair({
      userId: user.getId(),
      login: user.getLogin().getValue(),
      role: user.getRole()
    });

    const refreshTokenId = uuidv4();
    const refreshTokenEntity = RefreshToken.create({
      userId: user.getId(),
      token: tokenPair.refreshToken.getValue(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    }, refreshTokenId);

    await this.refreshTokenRepository.save(refreshTokenEntity);
    return tokenPair;
  }

  private async revokeRefreshToken(refreshToken: RefreshToken): Promise<void> {
    refreshToken.revoke();
    await this.refreshTokenRepository.save(refreshToken);
  }
}