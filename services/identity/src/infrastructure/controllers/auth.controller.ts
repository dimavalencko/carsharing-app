import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginUserDto } from '@app/dto/auth/login-user.dto';
import { TokensDto } from '@app/dto/auth/tokens.dto';
import type { CreateUserDto } from '@carsharing/common';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginUserDto: LoginUserDto): Promise<TokensDto> {
    const user = await this.authService.validateUser(
      loginUserDto.email,
      loginUserDto.password,
    );
    return this.authService.login(user);
  }

  // @Post('register')
  // @HttpCode(HttpStatus.OK)
  // async register(@Body() loginUserDto: CreateUserDto): Promise<TokensDto> {
  //   const user = await this.authService.validateUser(
  //     loginUserDto.email,
  //     loginUserDto.password,
  //   );
  //   return this.authService.login(user);
  // }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body('refreshToken') refreshToken: string): Promise<TokensDto> {
    return this.authService.refreshToken(refreshToken);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Body('userId') userId: string): Promise<void> {
    return this.authService.logout(userId);
  }
}