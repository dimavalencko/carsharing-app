import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from '../services/auth.service';
import { IdentityEndpoints, RegisterDto, LoginDto, ChangePasswordDto } from '@carsharing/common';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern(IdentityEndpoints.AUTH.REGISTER)
  async register(@Payload() data: { dto: RegisterDto }) {
    try {
      return await this.authService.register(data.dto);
    } catch (error) {
      return {
        error: error.message,
        statusCode: error.status || 500
      };
    }
  }

  @MessagePattern(IdentityEndpoints.AUTH.LOGIN)
  async login(@Payload() data: { dto: LoginDto }) {
    try {
      return await this.authService.login(data.dto);
    } catch (error) {
      return {
        error: error.message,
        statusCode: error.status || 500
      };
    }
  }

  @MessagePattern(IdentityEndpoints.AUTH.REFRESH)
  async refreshTokens(@Payload() data: { refreshToken: string }) {
    try {
      return await this.authService.refreshTokens(data.refreshToken);
    } catch (error) {
      return {
        error: error.message,
        statusCode: error.status || 500
      };
    }
  }

  @MessagePattern(IdentityEndpoints.AUTH.VALIDATE_TOKEN)
  async validateToken(@Payload() data: { token: string }) {
    try {
      const payload = this.authService['tokenService'].verifyAccessToken(data.token);
      return { valid: true, payload };
    } catch (error) {
      return { valid: false, error: error.message };
    }
  }

  @MessagePattern(IdentityEndpoints.AUTH.CHANGE_PASSWORD)
  async changePassword(@Payload() data: { userId: string; dto: ChangePasswordDto }) {
    try {
      await this.authService.changePassword(data.userId, data.dto);
      return { success: true };
    } catch (error) {
      return {
        error: error.message,
        statusCode: error.status || 500
      };
    }
  }

  @MessagePattern(IdentityEndpoints.AUTH.LOGOUT)
  async logout(@Payload() data: { userId: string; refreshToken?: string }) {
    try {
      await this.authService.logout(data.userId, data.refreshToken);
      return { success: true };
    } catch (error) {
      return {
        error: error.message,
        statusCode: error.status || 500
      };
    }
  }

  @MessagePattern(IdentityEndpoints.AUTH.VALIDATE_USER)
  async validateUser(@Payload() data: { email: string; password: string }) {
    try {
      const user = await this.authService.validateUser(data.email, data.password);
      return { user };
    } catch (error) {
      return {
        error: error.message,
        statusCode: error.status || 500
      };
    }
  }

  @MessagePattern(IdentityEndpoints.AUTH.REVOKE_SESSIONS)
  async revokeAllUserSessions(@Payload() data: { userId: string }) {
    try {
      await this.authService.revokeAllUserSessions(data.userId);
      return { success: true };
    } catch (error) {
      return {
        error: error.message,
        statusCode: error.status || 500
      };
    }
  }
}