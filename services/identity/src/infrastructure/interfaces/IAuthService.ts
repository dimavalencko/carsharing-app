import { User } from '@domain/entities/user.entity';
import { TokensDto } from '@app/dto/auth/tokens.dto';

export interface IAuthService {
  validateUser(email: string, password: string): Promise<User>;
  login(user: User): Promise<TokensDto>;
  refreshToken(refreshToken: string): Promise<TokensDto>;
  logout(userId: string): Promise<void>;
}