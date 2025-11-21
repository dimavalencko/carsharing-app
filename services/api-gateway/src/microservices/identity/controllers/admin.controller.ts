import {
  Controller,
  Post,
  Delete,
  Get,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { IdentityProxy } from '../proxy/identity.proxy';
import { JwtAuthGuard, AdminGuard } from '@src/guards';
import { CreateUserByAdminDto } from '../dto/admin/create-user-by-admin.dto';
import { CreateAdminDto } from '../dto/admin/create-admin.dto';

@Controller('identity/admin')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminController {
  constructor(private readonly identityProxy: IdentityProxy) {}

  @Post('users')
  async createUser(@Request() req, @Body() dto: CreateUserByAdminDto) {
    return this.identityProxy.adminCreateUser(
      req.user.sub || req.user.id || req.user.userId,
      dto,
    );
  }

  @Post('admins')
  async createAdmin(@Request() req, @Body() dto: CreateAdminDto) {
    return this.identityProxy.adminCreateAdmin(
      req.user.sub || req.user.id || req.user.userId,
      dto,
    );
  }

  @Get('users')
  async getAllUsers(@Request() req) {
    return this.identityProxy.adminGetAllUsers(
      req.user.sub || req.user.id || req.user.userId,
    );
  }

  @Delete('users/:id')
  async deleteUser(@Request() req, @Param('id') userId: string) {
    await this.identityProxy.adminDeleteUser(
      req.user.sub || req.user.id || req.user.userId,
      userId,
    );
    return { message: 'User deleted successfully' };
  }
}