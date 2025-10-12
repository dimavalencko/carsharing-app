import { AuthResponseDto, ChangePasswordDto, LoginDto, RegisterDto, TokensDto } from "@carsharing/common";

export interface IAuthService {
  register(dto: RegisterDto): Promise<AuthResponseDto>;
  login(dto: LoginDto): Promise<AuthResponseDto>;
  logout(userId: string, refreshToken?: string): Promise<void>;
  
  refreshTokens(refreshToken: string): Promise<TokensDto>;
  validateUser(email: string, password: string): Promise<{ id: string; role: string } | null>;
  
  changePassword(userId: string, dto: ChangePasswordDto): Promise<void>;
  revokeAllUserSessions(userId: string): Promise<void>;
}