import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { ServiceNames, IdentityEndpoints } from '@carsharing/common';
import { RegisterUserDto } from '../dto/auth/register-user.dto';
import { LoginUserDto } from '../dto/auth/login-user.dto';
import { ChangePasswordDto } from '../dto/auth/change-password.dto';
import { RefreshTokenDto } from '../dto/auth/refresh-token.dto';
import { AuthResponseDto } from '../dto/auth/auth-response.dto';
import { TokensDto } from '../dto/auth/tokens.dto';
import { CreateUserDto } from '../dto/user/create-user.dto';
import { UpdateUserDto } from '../dto/user/update-user.dto';
import { AddDriverLicenseDto } from '../dto/driver-license/add-driver-license.dto';
import { UpdateDriverLicenseDto } from '../dto/driver-license/update-driver-license.dto';
import { CreateUserByAdminDto } from '../dto/admin/create-user-by-admin.dto';
import { CreateAdminDto } from '../dto/admin/create-admin.dto';

@Injectable()
export class IdentityProxy {
  constructor(
    @Inject(ServiceNames.IDENTITY)
    private readonly identityClient: ClientProxy,
  ) {}

  private async send<T>(pattern: string, data: any): Promise<T> {
    const result = await firstValueFrom(
      this.identityClient.send<any>(pattern, data),
    );

    if (result && result.error) {
      throw new Error(result.error);
    }

    return result as T;
  }

  // ==================== AUTH ====================

  async register(dto: RegisterUserDto): Promise<AuthResponseDto> {
    return this.send<AuthResponseDto>(IdentityEndpoints.AUTH.REGISTER, dto);
  }

  async login(dto: LoginUserDto): Promise<AuthResponseDto> {
    return this.send<AuthResponseDto>(IdentityEndpoints.AUTH.LOGIN, dto);
  }

  async refresh(dto: RefreshTokenDto): Promise<TokensDto> {
    return this.send<TokensDto>(IdentityEndpoints.AUTH.REFRESH, dto);
  }

  async logout(userId: string, refreshToken?: string): Promise<{ success: boolean }> {
    return this.send<{ success: boolean }>(IdentityEndpoints.AUTH.LOGOUT, {
      userId,
      refreshToken,
    });
  }

  async changePassword(
    userId: string,
    dto: ChangePasswordDto,
  ): Promise<{ success: boolean }> {
    return this.send<{ success: boolean }>(
      IdentityEndpoints.AUTH.CHANGE_PASSWORD,
      {
        userId,
        oldPassword: dto.oldPassword,
        newPassword: dto.newPassword,
      },
    );
  }

  async validateToken(accessToken: string): Promise<any> {
    return this.send<any>(IdentityEndpoints.AUTH.VALIDATE_TOKEN, {
      accessToken,
    });
  }

  async validateUser(username: string, password: string): Promise<any> {
    return this.send<any>(IdentityEndpoints.AUTH.VALIDATE_USER, {
      login: username,
      password,
    });
  }

  async revokeSessions(userId: string): Promise<{ success: boolean }> {
    return this.send<{ success: boolean }>(
      IdentityEndpoints.AUTH.REVOKE_SESSIONS,
      { userId },
    );
  }

  // ==================== USERS ====================

  async getAllUsers(): Promise<any[]> {
    return this.send<any[]>(IdentityEndpoints.USERS.GET_ALL, {});
  }

  async getUserById(userId: string): Promise<any> {
    return this.send<any>(IdentityEndpoints.USERS.GET_BY_ID, { userId });
  }

  async getUserByEmail(email: string): Promise<any> {
    return this.send<any>(IdentityEndpoints.USERS.GET_BY_EMAIL, { email });
  }

  async getProfile(userId: string): Promise<any> {
    return this.send<any>(IdentityEndpoints.USERS.GET_PROFILE, { userId });
  }

  async updateUser(userId: string, dto: UpdateUserDto): Promise<any> {
    return this.send<any>(IdentityEndpoints.USERS.UPDATE, { userId, dto });
  }

  async updateProfile(userId: string, dto: UpdateUserDto): Promise<any> {
    return this.send<any>(IdentityEndpoints.USERS.UPDATE_PROFILE, {
      userId,
      dto,
    });
  }

  async deleteUser(userId: string): Promise<{ success: boolean }> {
    return this.send<{ success: boolean }>(IdentityEndpoints.USERS.DELETE, {
      userId,
    });
  }

  async createUser(dto: CreateUserDto): Promise<any> {
    return this.send<any>(IdentityEndpoints.USERS.CREATE, dto);
  }

  async existsByLogin(login: string): Promise<{ exists: boolean }> {
    return this.send<{ exists: boolean }>(
      IdentityEndpoints.USERS.EXISTS_BY_LOGIN,
      { login },
    );
  }

  async existsByEmail(email: string): Promise<{ exists: boolean }> {
    return this.send<{ exists: boolean }>(
      IdentityEndpoints.USERS.EXISTS_BY_EMAIL,
      { email },
    );
  }

  // ==================== DRIVER LICENSE ====================

  async getDriverLicenseByUserId(userId: string): Promise<any> {
    return this.send<any>(IdentityEndpoints.DRIVER_LICENSE.GET_BY_USER_ID, {
      userId,
    });
  }

  async createDriverLicense(userId: string, dto: AddDriverLicenseDto): Promise<any> {
    return this.send<any>(IdentityEndpoints.DRIVER_LICENSE.CREATE, {
      userId,
      dto,
    });
  }

  async updateDriverLicense(
    userId: string,
    dto: UpdateDriverLicenseDto,
  ): Promise<any> {
    return this.send<any>(IdentityEndpoints.DRIVER_LICENSE.UPDATE, {
      userId,
      dto,
    });
  }

  async deleteDriverLicense(userId: string): Promise<{ success: boolean }> {
    return this.send<{ success: boolean }>(
      IdentityEndpoints.DRIVER_LICENSE.DELETE,
      { userId },
    );
  }

  // ==================== ADMIN ====================

  async adminCreateUser(adminId: string, dto: CreateUserByAdminDto): Promise<any> {
    return this.send<any>(IdentityEndpoints.ADMIN.CREATE_USER, {
      adminId,
      dto,
    });
  }

  async adminCreateAdmin(adminId: string, dto: CreateAdminDto): Promise<any> {
    return this.send<any>(IdentityEndpoints.ADMIN.CREATE_ADMIN, {
      adminId,
      dto,
    });
  }

  async adminGetAllUsers(adminId: string): Promise<any[]> {
    return this.send<any[]>(IdentityEndpoints.ADMIN.GET_ALL_USERS, {
      adminId,
    });
  }

  async adminDeleteUser(adminId: string, userId: string): Promise<{ success: boolean }> {
    return this.send<{ success: boolean }>(IdentityEndpoints.ADMIN.DELETE_USER, {
      adminId,
      userId,
    });
  }

  // ==================== HEALTH ====================

  async checkHealth(): Promise<any> {
    return this.send<any>(IdentityEndpoints.HEALTH.CHECK, {});
  }

  async checkDatabase(): Promise<any> {
    return this.send<any>(IdentityEndpoints.HEALTH.CHECK_DB, {});
  }
}