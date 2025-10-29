import { IRefreshTokenRepository, IUserRepository } from "@/domain/interfaces/repositories";
import { IPasswordHasher, ITokenService } from "@/domain/interfaces/services";
import { AuthService, TokenPair } from "@/domain/services/auth.service";

export class RefreshTokensUseCase {
  private authService: AuthService;

  constructor(
    userRepository: IUserRepository,
    refreshTokenRepository: IRefreshTokenRepository,
    tokenService: ITokenService,
    passwordHasher: IPasswordHasher
  ) {
    this.authService = new AuthService(
      userRepository,
      refreshTokenRepository,
      tokenService,
      passwordHasher
    );
  }

  async execute(refreshToken: string): Promise<TokenPair> {
    return await this.authService.refresh({ refreshToken });
  }
}
