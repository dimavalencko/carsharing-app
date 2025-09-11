import { Controller, Get, Post, Body, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
  ) {}

  @Post('register')
  async register(@Body() registerData: any) {
    try {
      const result = await firstValueFrom(
        this.authClient.send('auth_register', registerData)
      );
      return result;
    } catch (error) {
      throw new Error('Auth service unavailable');
    }
  }

  @Post('login')
  async login(@Body() loginData: any) {
    try {
      const result = await firstValueFrom(
        this.authClient.send('auth_login', loginData)
      );
      return result;
    } catch (error) {
      throw new Error('Auth service unavailable');
    }
  }

  @Get('health')
  async healthCheck() {
    try {
      const result = await firstValueFrom(
        this.authClient.send('auth_health', {})
      );
      return { status: 'healthy', authService: result };
    } catch (error) {
      return { status: 'unhealthy', error: error.message };
    }
  }
}