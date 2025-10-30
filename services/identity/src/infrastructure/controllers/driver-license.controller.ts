import { Controller, Inject } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { IdentityEndpoints } from '@carsharing/common';
import { DriverLicenseService } from '@/application/services/driver-license.service';
import { AddDriverLicenseDto } from '@/application/dto/driver-license/add-driver-license.dto';
import { UpdateDriverLicenseDto } from '@/application/dto/driver-license/update-driver-license.dto';

@Controller()
export class DriverLicenseController {
  constructor(
    @Inject('DriverLicenseService')
    private readonly driverLicenseService: DriverLicenseService,
  ) {}

  @MessagePattern(IdentityEndpoints.DRIVER_LICENSE.CREATE)
  async create(@Payload() data: { userId: string; dto: AddDriverLicenseDto }) {
    try {
      return await this.driverLicenseService.create(data.userId, data.dto);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return { error: message, statusCode: 400 };
    }
  }

  @MessagePattern(IdentityEndpoints.DRIVER_LICENSE.GET_BY_USER_ID)
  async getByUserId(@Payload() data: { userId: string }) {
    const license = await this.driverLicenseService.getByUserId(data.userId);
    if (!license) {
      return { error: 'Driver license not found', statusCode: 404 };
    }
    return license;
  }

  @MessagePattern(IdentityEndpoints.DRIVER_LICENSE.UPDATE)
  async update(@Payload() data: { userId: string; dto: UpdateDriverLicenseDto }) {
    try {
      return await this.driverLicenseService.update(data.userId, data.dto);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return { error: message, statusCode: 400 };
    }
  }

  @MessagePattern(IdentityEndpoints.DRIVER_LICENSE.DELETE)
  async delete(@Payload() data: { userId: string }) {
    try {
      await this.driverLicenseService.delete(data.userId);
      return { success: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return { error: message, statusCode: 400 };
    }
  }
}
