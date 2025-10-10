import { Controller } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginUserDto } from '@app/dto/auth/login-user.dto';
import { TokensDto } from '@app/dto/auth/tokens.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { IdentityEndpoints } from '@carsharing/common';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern(IdentityEndpoints.AUTH.LOGIN)
  async login(@Payload() loginUserDto: LoginUserDto): Promise<TokensDto> {
    const user = await this.authService.validateUser(
      loginUserDto.email,
      loginUserDto.password,
    );
    return this.authService.login(user);
  }

  @MessagePattern(IdentityEndpoints.AUTH.REFRESH)
  async refresh(@Payload() data: { refreshToken: string }): Promise<TokensDto> {
    return this.authService.refreshToken(data.refreshToken);
  }

  // @MessagePattern(IdentityEndpoints.AUTH.LOGOUT)
  // async logout(@Payload() data: { userId: string }): Promise<void> {
  //   return this.authService.logout(data.userId);
  // }
}