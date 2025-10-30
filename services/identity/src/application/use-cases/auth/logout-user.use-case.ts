import {
  IRefreshTokenRepository,
  IUserRepository,
} from '@/domain/interfaces/repositories';
import { IPasswordHasher, ITokenService } from '@/domain/interfaces/services';
import { AuthService } from '@/domain/services/auth.service';

export class LogoutUserUseCase {
  private authService: AuthService;

  constructor(
    userRepository: IUserRepository,
    refreshTokenRepository: IRefreshTokenRepository,
    tokenService: ITokenService,
    passwordHasher: IPasswordHasher,
  ) {
    this.authService = new AuthService(
      userRepository,
      refreshTokenRepository,
      tokenService,
      passwordHasher,
    );
  }

  async execute(refreshToken: string): Promise<void> {
    await this.authService.logout(refreshToken);
  }
}
