import { Controller, Post, Get, Body, Param, Put, Inject, ParseUUIDPipe, Delete } from '@nestjs/common';
import type { CreateUserDto } from '@carsharing/common';
import { IdentityProxy } from '../proxy/identity.proxy';

@Controller('identity/users')
export class UsersController {
  constructor(private readonly identityProxy: IdentityProxy) {}

  @Get()
  async getUsers() {
    return this.identityProxy.getAllUsers();
  }

  @Get('/:id')
  async getUser(@Param('id', ParseUUIDPipe) userId: string) {
    return this.identityProxy.getUserById(userId);
  }

  @Post()
  async createUser(@Body() user: CreateUserDto) {
    return this.identityProxy.createUser(user)
  }

  @Put('/:id')
  async updateUser(@Param('id', ParseUUIDPipe) userId: string, @Body() user: CreateUserDto) {
    return this.identityProxy.updateUser(userId, user)
  }

  @Delete('/:id')
  async deleteUser(@Param('id', ParseUUIDPipe) userId: string) {
    return this.identityProxy.deleteUser(userId)
  }

  // @Put('user/:id/settings')
  // async updateUser(@Param('id') userId: string, @Body() settings: any) {
  //   try {
  //     const result = await firstValueFrom(
  //       this.identityProxy.send(IdentityEndpoints.USERS.UPDATE, { userId, settings })
  //     );
  //     return { success: true, data: result };
  //   } catch (error) {
  //     return { success: false, error: error.message };
  //   }
  // }

  // @Get('health/identity')
  // async healthCheck() {
  //   try {
  //     const result = await firstValueFrom(
  //       this.identityProxy.send(IdentityEndpoints.HEALTH.CHECK, {})
  //     );
  //     return { status: 'healthy', identityService: result };
  //   } catch (error) {
  //     return { status: 'unhealthy', error: error.message };
  //   }
  // }

  // @Get('health/identity/db')
  // async healthCheckDb() {
  //   try {
  //     const result = await firstValueFrom(
  //       this.identityProxy.send(IdentityEndpoints.HEALTH.CHECK_DB, {})
  //     );
  //     return { status: 'healthy', identityService: result };
  //   } catch (error) {
  //     return { status: 'unhealthy', error: error.message };
  //   }
  // }
}