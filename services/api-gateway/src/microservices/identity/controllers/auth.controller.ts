import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
  Req,
  Res,
} from '@nestjs/common';
import type { Request as ExpressRequest, Response as ExpressResponse } from 'express';
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
  async register(@Body() dto: RegisterUserDto, @Res({ passthrough: true }) res: ExpressResponse) {
    const result = await this.identityProxy.register(dto);
    
    this.setAuthCookies(res, result.accessToken, result.refreshToken);
    
    return {
      userId: result.userId,
      username: result.username,
      role: result.role,
    };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginUserDto, @Res({ passthrough: true }) res: ExpressResponse) {
    const result = await this.identityProxy.login(dto);
    
    this.setAuthCookies(res, result.accessToken, result.refreshToken);
    
    return {
      userId: result.userId,
      username: result.username,
      role: result.role,
    };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Req() req: ExpressRequest, @Res({ passthrough: true }) res: ExpressResponse) {

    const refreshToken = req.cookies?.refreshToken;
    
    if (!refreshToken) {
      throw new Error('Refresh token not found');
    }
    
    const result = await this.identityProxy.refresh({ refreshToken });
    
    this.setAuthCookies(res, result.accessToken, result.refreshToken);
    
    return { success: true };
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async logout(@Request() req, @Res({ passthrough: true }) res: ExpressResponse) {
    const refreshToken = req.cookies?.refreshToken;
    
    await this.identityProxy.logout(
      req.user.sub || req.user.id || req.user.userId,
      refreshToken,
    );
    
    this.clearAuthCookies(res);
    
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
  async revokeSessions(@Request() req, @Res({ passthrough: true }) res: ExpressResponse) {
    await this.identityProxy.revokeSessions(
      req.user.sub || req.user.id || req.user.userId,
    );
    
    this.clearAuthCookies(res);
    
    return { message: 'All sessions revoked successfully' };
  }

  private setAuthCookies(res: any, accessToken: string, refreshToken: string) {
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict' as const,
      path: '/',
    };

    res.cookie('accessToken', accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000, // 15 минут
    });

    res.cookie('refreshToken', refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 дней
    });
  }

  private clearAuthCookies(res: any) {
    res.clearCookie('accessToken', { path: '/' });
    res.clearCookie('refreshToken', { path: '/' });
  }
}