import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { IdentityEndpoints } from '@carsharing/common';
import { AuthFacadeService } from '@/infrastructure/services/auth-facade.service';

@Controller()
export class AuthController {
  constructor(private readonly auth: AuthFacadeService) {}

  @MessagePattern(IdentityEndpoints.AUTH.REGISTER)
  async register(
    @Payload()
    data: {
      dto: {
        login: string;
        password: string;
        firstName: string;
        lastName?: string;
      };
    },
  ) {
    return this.auth.register(data.dto);
  }

  @MessagePattern(IdentityEndpoints.AUTH.LOGIN)
  async login(@Payload() data: { dto: { login: string; password: string } }) {
    return this.auth.login(data.dto);
  }

  @MessagePattern(IdentityEndpoints.AUTH.REFRESH)
  async refresh(@Payload() data: { refreshToken: string }) {
    return this.auth.refresh(data.refreshToken);
  }

  @MessagePattern(IdentityEndpoints.AUTH.CHANGE_PASSWORD)
  async changePassword(
    @Payload()
    data: {
      userId: string;
      dto: { oldPassword: string; newPassword: string };
    },
  ) {
    await this.auth.changePassword(data.userId, data.dto);
    return { success: true };
  }

  @MessagePattern(IdentityEndpoints.AUTH.LOGOUT)
  async logout(@Payload() data: { userId: string; refreshToken?: string }) {
    await this.auth.logout(data.userId, data.refreshToken);
    return { success: true };
  }
}
