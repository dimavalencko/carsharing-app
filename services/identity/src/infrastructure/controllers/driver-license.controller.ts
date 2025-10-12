import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { DriverLicenseService } from '../services/driver-license.service';
import { IdentityEndpoints, CreateDriverLicenseDto, UpdateDriverLicenseDto } from '@carsharing/common';

@Controller()
export class DriverLicenseController {
  constructor(private readonly driverLicenseService: DriverLicenseService) {}

  @MessagePattern(IdentityEndpoints.DRIVER_LICENSE.CREATE)
  async createDriverLicense(@Payload() data: { userId: string; dto: CreateDriverLicenseDto }) {
    try {
      return await this.driverLicenseService.createDriverLicense(data.userId, data.dto);
    } catch (error) {
      return {
        error: error.message,
        statusCode: error.status || 500
      };
    }
  }

  @MessagePattern(IdentityEndpoints.DRIVER_LICENSE.GET)
  async getDriverLicense(@Payload() data: { userId: string }) {
    try {
      return await this.driverLicenseService.getDriverLicense(data.userId);
    } catch (error) {
      return {
        error: error.message,
        statusCode: error.status || 500
      };
    }
  }

  @MessagePattern(IdentityEndpoints.DRIVER_LICENSE.UPDATE)
  async updateDriverLicense(@Payload() data: { userId: string; dto: UpdateDriverLicenseDto }) {
    try {
      return await this.driverLicenseService.updateDriverLicense(data.userId, data.dto);
    } catch (error) {
      return {
        error: error.message,
        statusCode: error.status || 500
      };
    }
  }

  @MessagePattern(IdentityEndpoints.DRIVER_LICENSE.DELETE)
  async deleteDriverLicense(@Payload() data: { userId: string }) {
    try {
      await this.driverLicenseService.deleteDriverLicense(data.userId);
      return { success: true };
    } catch (error) {
      return {
        error: error.message,
        statusCode: error.status || 500
      };
    }
  }

  @MessagePattern(IdentityEndpoints.DRIVER_LICENSE.CAN_RENT_CAR)
  async canUserRentCar(@Payload() data: { userId: string }) {
    try {
      const canRent = await this.driverLicenseService.canUserRentCar(data.userId);
      return { canRent };
    } catch (error) {
      return {
        error: error.message,
        statusCode: error.status || 500
      };
    }
  }

  @MessagePattern(IdentityEndpoints.DRIVER_LICENSE.GET_STATUS)
  async getDriverLicenseStatus(@Payload() data: { userId: string }) {
    try {
      return await this.driverLicenseService.getDriverLicenseStatus(data.userId);
    } catch (error) {
      return {
        error: error.message,
        statusCode: error.status || 500
      };
    }
  }
}