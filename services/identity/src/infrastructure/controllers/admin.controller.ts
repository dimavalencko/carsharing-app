import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AdminService } from '../services/admin.service';
import { IdentityEndpoints } from '@carsharing/common';

@Controller()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @MessagePattern(IdentityEndpoints.ADMIN.GET_ALL_USERS)
  async getAllUsers() {
    try {
      return await this.adminService.getAllUsers();
    } catch (error) {
      return {
        error: error.message,
        statusCode: error.status || 500
      };
    }
  }

  @MessagePattern(IdentityEndpoints.ADMIN.GET_USER_DETAILS)
  async getUserDetails(@Payload() data: { userId: string }) {
    try {
      return await this.adminService.getUserDetails(data.userId);
    } catch (error) {
      return {
        error: error.message,
        statusCode: error.status || 500
      };
    }
  }

  @MessagePattern(IdentityEndpoints.ADMIN.GET_USER_DRIVER_LICENSE)
  async getUserDriverLicense(@Payload() data: { userId: string }) {
    try {
      return await this.adminService.getUserDriverLicense(data.userId);
    } catch (error) {
      return {
        error: error.message,
        statusCode: error.status || 500
      };
    }
  }

  @MessagePattern(IdentityEndpoints.ADMIN.GET_SYSTEM_STATS)
  async getSystemStats() {
    try {
      return await this.adminService.getSystemStats();
    } catch (error) {
      return {
        error: error.message,
        statusCode: error.status || 500
      };
    }
  }

  @MessagePattern(IdentityEndpoints.ADMIN.GET_ACTIVE_SESSIONS)
  async getActiveSessionsCount() {
    try {
      const count = await this.adminService.getActiveSessionsCount();
      return { count };
    } catch (error) {
      return {
        error: error.message,
        statusCode: error.status || 500
      };
    }
  }

  @MessagePattern(IdentityEndpoints.ADMIN.FORCE_LOGOUT_USER)
  async forceLogoutUser(@Payload() data: { userId: string }) {
    try {
      await this.adminService.forceLogoutUser(data.userId);
      return { success: true };
    } catch (error) {
      return {
        error: error.message,
        statusCode: error.status || 500
      };
    }
  }

  @MessagePattern(IdentityEndpoints.ADMIN.GET_LOGIN_HISTORY)
  async getUserLoginHistory(@Payload() data: { userId: string }) {
    try {
      const history = await this.adminService.getUserLoginHistory(data.userId);
      return { history };
    } catch (error) {
      return {
        error: error.message,
        statusCode: error.status || 500
      };
    }
  }
}