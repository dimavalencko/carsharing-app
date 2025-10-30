import { Controller, Inject } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { IdentityEndpoints } from '@carsharing/common';
import { AdminManagementService } from '@/application/services/admin-management.service';

@Controller()
export class AdminController {
  constructor(
    @Inject('AdminManagementService')
    private readonly adminService: AdminManagementService,
  ) {}

  @MessagePattern(IdentityEndpoints.ADMIN.CREATE_USER)
  async createUser(@Payload() data: { adminId: string; dto: any }) {
    try {
      return await this.adminService.createUser(data.adminId, data.dto);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return { error: message, statusCode: 400 };
    }
  }

  @MessagePattern(IdentityEndpoints.ADMIN.CREATE_ADMIN)
  async createAdmin(@Payload() data: { adminId: string; dto: any }) {
    try {
      return await this.adminService.createAdmin(data.adminId, data.dto);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return { error: message, statusCode: 400 };
    }
  }

  @MessagePattern(IdentityEndpoints.ADMIN.DELETE_USER)
  async deleteUser(@Payload() data: { adminId: string; userId: string }) {
    try {
      await this.adminService.deleteUser(data.adminId, data.userId);
      return { success: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return { error: message, statusCode: 400 };
    }
  }

  @MessagePattern(IdentityEndpoints.ADMIN.GET_ALL_USERS)
  async getAllUsers(@Payload() data: { adminId: string }) {
    return this.adminService.getAllUsers(data.adminId);
  }
}
