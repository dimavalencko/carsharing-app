import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserService } from '../services/user.service';
import { IdentityEndpoints, UpdateUserDto, UpdateProfileDto } from '@carsharing/common';
@Controller()
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern(IdentityEndpoints.USERS.GET_BY_ID)
  async getUserById(@Payload() data: { id: string }) {
    try {
      return await this.userService.getUserById(data.id);
    } catch (error) {
      return {
        error: error.message,
        statusCode: error.status || 500
      };
    }
  }

  @MessagePattern(IdentityEndpoints.USERS.GET_BY_EMAIL)
  async getUserByEmail(@Payload() data: { email: string }) {
    try {
      return await this.userService.getUserByEmail(data.email);
    } catch (error) {
      return {
        error: error.message,
        statusCode: error.status || 500
      };
    }
  }

  @MessagePattern(IdentityEndpoints.USERS.UPDATE)
  async updateUser(@Payload() data: { userId: string; dto: UpdateUserDto }) {
    try {
      return await this.userService.updateUser(data.userId, data.dto);
    } catch (error) {
      return {
        error: error.message,
        statusCode: error.status || 500
      };
    }
  }

  @MessagePattern(IdentityEndpoints.USERS.DELETE)
  async deleteUser(@Payload() data: { userId: string }) {
    try {
      await this.userService.deleteUser(data.userId);
      return { success: true };
    } catch (error) {
      return {
        error: error.message,
        statusCode: error.status || 500
      };
    }
  }

  @MessagePattern(IdentityEndpoints.USERS.GET_PROFILE)
  async getUserProfile(@Payload() data: { userId: string }) {
    try {
      return await this.userService.getUserProfile(data.userId);
    } catch (error) {
      return {
        error: error.message,
        statusCode: error.status || 500
      };
    }
  }

  @MessagePattern(IdentityEndpoints.USERS.UPDATE_PROFILE)
  async updateUserProfile(@Payload() data: { userId: string; dto: UpdateProfileDto }) {
    try {
      return await this.userService.updateUserProfile(data.userId, data.dto);
    } catch (error) {
      return {
        error: error.message,
        statusCode: error.status || 500
      };
    }
  }
}