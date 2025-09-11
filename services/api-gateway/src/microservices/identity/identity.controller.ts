import { Controller, Post, Get, Body, Param, Put, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Controller('identity')
export class IdentityController {
  constructor(
    @Inject('IDENTITY') private readonly identityClient: ClientProxy,
  ) {}

  @Post('register')
  async register(@Body() registerData: any) {
    try {
      const result = await firstValueFrom(
        this.identityClient.send('identity_register', registerData)
      );
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @Post('login')
  async login(@Body() loginData: any) {
    try {
      const result = await firstValueFrom(
        this.identityClient.send('identity_login', loginData)
      );
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @Get('user/:id')
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
  async updateSettings(@Param('id') userId: string, @Body() settings: any) {
    try {
      const result = await firstValueFrom(
        this.identityClient.send('identity_update_settings', { userId, settings })
      );
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @Get('health')
  async healthCheck() {
    try {
      const result = await firstValueFrom(
        this.identityClient.send('identity_health', {})
      );
      return { status: 'healthy', identityService: result };
    } catch (error) {
      return { status: 'unhealthy', error: error.message };
    }
  }
}