import {
  Controller,
  Get,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { IdentityProxy } from '../proxy/identity.proxy';
import { JwtAuthGuard } from '@src/guards';
import { UpdateUserDto } from '../dto/user/update-user.dto';

@Controller('identity/users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly identityProxy: IdentityProxy) {}

  @Get()
  async getAll() {
    return this.identityProxy.getAllUsers();
  }

  @Get(':id')
  async getUserById(@Param('id') id: string) {
    return this.identityProxy.getUserById(id);
  }

  @Get('by-email')
  async getByEmail(@Query('email') email: string) {
    if(!email) {
      return { message: 'Email query parameter is required' };
    }
    return this.identityProxy.getUserByEmail(email);
  }

  @Get('profile')
  async getMyProfile(@Request() req) {
    return this.identityProxy.getProfile(
      req.user.sub || req.user.id || req.user.userId,
    );
  }

  @Put('profile')
  async updateProfile(@Request() req, @Body() dto: UpdateUserDto) {
    return this.identityProxy.updateProfile(
      req.user.sub || req.user.id || req.user.userId,
      dto,
    );
  }

  @Put(':id')
  async updateUser(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.identityProxy.updateUser(id, dto);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    await this.identityProxy.deleteUser(id);
    return { message: 'User deleted successfully' };
  }
}