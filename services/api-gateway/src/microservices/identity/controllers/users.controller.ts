import { Controller, Post, Get, Body, Param, Put, Inject, ParseUUIDPipe } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { IdentityEndpoints } from '@carsharing/common';
import { IdentityProxy } from '../proxy/identity.proxy';

@Controller('users')
export class UsersController {
  constructor(private readonly identityProxy: IdentityProxy,) {}


  @Get()
  @MessagePattern(IdentityEndpoints.USERS.GET_BY_ID)
  async getUsers() {
    return this.identityProxy.getAllUsers();
  }

  @Get('user/:id')
  @MessagePattern(IdentityEndpoints.USERS.GET_BY_ID)
  async getUser(@Param('id', ParseUUIDPipe) userId: string) {
    return this.identityProxy.getUserById(userId);
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