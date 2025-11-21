import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { IdentityProxy } from '../proxy/identity.proxy';
import { JwtAuthGuard } from '@src/guards';
import { AddDriverLicenseDto } from '../dto/driver-license/add-driver-license.dto';
import { UpdateDriverLicenseDto } from '../dto/driver-license/update-driver-license.dto';

@Controller('identity/driver-license')
@UseGuards(JwtAuthGuard)
export class DriverLicenseController {
  constructor(private readonly identityProxy: IdentityProxy) {}

  @Get()
  async getMyDriverLicense(@Request() req) {
    return this.identityProxy.getDriverLicenseByUserId(
      req.user.sub || req.user.id || req.user.userId,
    );
  }

  @Get('user/:userId')
  async getDriverLicense(@Param('userId') userId: string) {
    return this.identityProxy.getDriverLicenseByUserId(userId);
  }

  @Post()
  async createDriverLicense(@Request() req, @Body() dto: AddDriverLicenseDto) {
    return this.identityProxy.createDriverLicense(
      req.user.sub || req.user.id || req.user.userId,
      dto,
    );
  }

  @Put()
  async updateDriverLicense(@Request() req, @Body() dto: UpdateDriverLicenseDto) {
    return this.identityProxy.updateDriverLicense(
      req.user.sub || req.user.id || req.user.userId,
      dto,
    );
  }

  @Delete()
  async deleteDriverLicense(@Request() req) {
    await this.identityProxy.deleteDriverLicense(
      req.user.sub || req.user.id || req.user.userId,
    );
    return { message: 'Driver license deleted successfully' };
  }
}