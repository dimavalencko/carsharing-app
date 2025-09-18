import { Controller, Post, Get, Body, Param, Put, Inject } from '@nestjs/common';
import { ClientProxy, MessagePattern } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { IdentityEndpoints } from '@carsharing/common/';

@Controller('identity')
export class IdentityController {
  constructor(
    @Inject('IDENTITY') private readonly identityClient: ClientProxy,
  ) {}

  async register(@Body() registerData: any) {
    try {
      const result = await firstValueFrom(
        this.identityClient.send(IdentityEndpoints.AUTH.REGISTER, registerData)
      );
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @Post()
  async login(@Body() loginData: any) {
    try {
      const result = await firstValueFrom(
        this.identityClient.send(IdentityEndpoints.AUTH.LOGIN, loginData)
      );
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @Get('user/:id')
  @MessagePattern(IdentityEndpoints.USERS.FIND_BY_ID)
  async getUser(@Param('id') userId: string) {
    try {
      const result = await firstValueFrom(
        this.identityClient.send('identity_get_user', userId)
      );
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @Put('user/:id/settings')
  async updateUser(@Param('id') userId: string, @Body() settings: any) {
    try {
      const result = await firstValueFrom(
        this.identityClient.send(IdentityEndpoints.USERS.UPDATE, { userId, settings })
      );
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @Get('health/identity')
  async healthCheck() {
    try {
      const result = await firstValueFrom(
        this.identityClient.send(IdentityEndpoints.HEALTH.CHECK, {})
      );
      return { status: 'healthy', identityService: result };
    } catch (error) {
      return { status: 'unhealthy', error: error.message };
    }
  }

  @Get('health/identity/db')
  async healthCheckDb() {
    try {
      const result = await firstValueFrom(
        this.identityClient.send(IdentityEndpoints.HEALTH.CHECK_DB, {})
      );
      return { status: 'healthy', identityService: result };
    } catch (error) {
      return { status: 'unhealthy', error: error.message };
    }
  }
}