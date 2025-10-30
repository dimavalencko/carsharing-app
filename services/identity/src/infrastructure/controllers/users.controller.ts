import { Controller, Inject } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { IdentityEndpoints } from '@carsharing/common';
import { UsersManagementService } from '@/application/services/users-management.service';

@Controller()
export class UsersController {
  constructor(
    @Inject('UsersManagementService')
    private readonly usersManagement: UsersManagementService,
  ) {}

  @MessagePattern(IdentityEndpoints.USERS.GET_BY_ID)
  async getUserById(@Payload() data: { userId: string }) {
    const user = await this.usersManagement.getUserById(data.userId);
    if (!user) {
      return { error: 'User not found', statusCode: 404 };
    }
    return user;
  }

  @MessagePattern(IdentityEndpoints.USERS.GET_ALL)
  async getAll() {
    return this.usersManagement.getAll();
  }

  @MessagePattern(IdentityEndpoints.USERS.GET_BY_EMAIL)
  async getByEmail(@Payload() data: { email: string }) {
    const user = await this.usersManagement.getByEmail(data.email);
    if (!user) {
      return { error: 'User not found', statusCode: 404 };
    }
    return user;
  }

  @MessagePattern(IdentityEndpoints.USERS.UPDATE)
  async updateUser(@Payload() data: { userId: string; dto: any }) {
    try {
      const user = await this.usersManagement.updateUser(data.userId, data.dto);
      return user;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return { error: message, statusCode: 400 };
    }
  }

  @MessagePattern(IdentityEndpoints.USERS.GET_PROFILE)
  async getProfile(@Payload() data: { userId: string }) {
    const user = await this.usersManagement.getProfile(data.userId);
    if (!user) {
      return { error: 'User not found', statusCode: 404 };
    }
    return user;
  }

  @MessagePattern(IdentityEndpoints.USERS.UPDATE_PROFILE)
  async updateProfile(
    @Payload()
    data: {
      userId: string;
      dto: {
        firstName?: string;
        lastName?: string;
        phoneNumber?: string;
      };
    },
  ) {
    try {
      const user = await this.usersManagement.updateUserProfile(
        data.userId,
        data.dto,
      );
      return user;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return { error: message, statusCode: 400 };
    }
  }

  @MessagePattern(IdentityEndpoints.USERS.DELETE)
  async deleteUser(@Payload() data: { userId: string }) {
    try {
      await this.usersManagement.deleteUser(data.userId);
      return { success: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return { error: message, statusCode: 400 };
    }
  }
}
