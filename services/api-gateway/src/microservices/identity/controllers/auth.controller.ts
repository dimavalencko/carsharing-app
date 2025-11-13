import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
} from '@nestjs/common';
import { IdentityProxy } from '../proxy/identity.proxy';
import { JwtAuthGuard } from '@src/guards';
import { RegisterUserDto } from '../dto/auth/register-user.dto';
import { LoginUserDto } from '../dto/auth/login-user.dto';
import { ChangePasswordDto } from '../dto/auth/change-password.dto';
import { RefreshTokenDto } from '../dto/auth/refresh-token.dto';

@Controller('identity/auth')
export class AuthController {
  constructor(private readonly identityProxy: IdentityProxy) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() dto: RegisterUserDto) {
    return this.identityProxy.register(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginUserDto) {
    return this.identityProxy.login(dto);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() dto: RefreshTokenDto) {
    return this.identityProxy.refresh(dto);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async logout(@Request() req, @Body() body: { refreshToken?: string }) {
    await this.identityProxy.logout(
      req.user.sub || req.user.id || req.user.userId,
      body.refreshToken,
    );
    return { message: 'Logged out successfully' };
  }

  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async changePassword(@Request() req, @Body() dto: ChangePasswordDto) {
    await this.identityProxy.changePassword(
      req.user.sub || req.user.id || req.user.userId,
      dto,
    );
    return { message: 'Password changed successfully' };
  }

  @Post('validate-token')
  @HttpCode(HttpStatus.OK)
  async validateToken(@Body('accessToken') accessToken: string) {
    return this.identityProxy.validateToken(accessToken);
  }

  @Post('validate-user')
  @HttpCode(HttpStatus.OK)
  async validateUser(@Body() dto: LoginUserDto) {
    return this.identityProxy.validateUser(dto.username, dto.password);
  }

  @Post('revoke-sessions')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async revokeSessions(@Request() req) {
    await this.identityProxy.revokeSessions(
      req.user.sub || req.user.id || req.user.userId,
    );
    return { message: 'All sessions revoked successfully' };
  }
}