import {
  IRefreshTokenRepository,
  IUserRepository,
} from '@/domain/interfaces/repositories';
import { IPasswordHasher, ITokenService } from '@/domain/interfaces/services';
import { AuthService, TokenPair } from '@/domain/services/auth.service';
import { LoginUserDto } from '@/application/dto/auth/auth-request.dto';

export class LoginUserUseCase {
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

  async execute(dto: LoginUserDto): Promise<TokenPair> {
    return await this.authService.login({
      login: dto.username,
      password: dto.password,
    });
  }
}
