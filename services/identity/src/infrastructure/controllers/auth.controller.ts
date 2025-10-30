import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { IdentityEndpoints } from '@carsharing/common';
import { AuthFacadeService } from '@/infrastructure/services/auth-facade.service';


@Controller()
export class AuthController {
  constructor(private readonly auth: AuthFacadeService) {}

  @MessagePattern(IdentityEndpoints.AUTH.REGISTER)
  async register(@Payload() data: { login: string; password: string; firstName: string; lastName?: string }) {
    try {
      return await this.auth.register(data);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return { error: message, statusCode: 400 };
    }
  }

  @MessagePattern(IdentityEndpoints.AUTH.LOGIN)
  async login(@Payload() data: { login: string; password: string }) {
    try {
      return await this.auth.login(data);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return { error: message, statusCode: 401 };
    }
  }

  @MessagePattern(IdentityEndpoints.AUTH.REFRESH)
  async refresh(@Payload() data: { refreshToken: string }) {
    try {
      return await this.auth.refresh(data.refreshToken);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return { error: message, statusCode: 401 };
    }
  }

  @MessagePattern(IdentityEndpoints.AUTH.CHANGE_PASSWORD)
  async changePassword(@Payload() data: { userId: string; oldPassword: string; newPassword: string }) {
    try {
      await this.auth.changePassword(data.userId, { oldPassword: data.oldPassword, newPassword: data.newPassword });
      return { success: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return { error: message, statusCode: 400 };
    }
  }

  @MessagePattern(IdentityEndpoints.AUTH.LOGOUT)
  async logout(@Payload() data: { userId: string; refreshToken?: string }) {
    try {
      await this.auth.logout(data.userId, data.refreshToken);
      return { success: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return { error: message, statusCode: 400 };
    }
  }

  @MessagePattern(IdentityEndpoints.AUTH.VALIDATE_TOKEN)
  async validateToken(@Payload() data: { accessToken: string }) {
    try {
      return { valid: true, statusCode: 200 };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return { error: message, statusCode: 401 };
    }
  }
  

  @MessagePattern(IdentityEndpoints.AUTH.VALIDATE_USER)
  async validateUser(@Payload() data: { login: string; password: string }) {
    try {
      const user = await this.auth.validateUser(data.login, data.password);
      if (!user) return { error: 'Invalid credentials', statusCode: 401 };
      return user;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return { error: message, statusCode: 401 };
    }
  }

  @MessagePattern(IdentityEndpoints.AUTH.REVOKE_SESSIONS)
  async revokeSessions(@Payload() data: { userId: string }) {
    try {
      await this.auth.logout(data.userId);
      return { success: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return { error: message, statusCode: 400 };
    }
  }
}
