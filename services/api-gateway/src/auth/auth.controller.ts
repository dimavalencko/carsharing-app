import { LoginUserDto, RegisterUserDto } from '@carsharing/common';
import { Controller, Get, Post, Body, Inject } from '@nestjs/common';
import { IdentityProxy } from 'src/microservices/identity/proxy/identity.proxy';

@Controller('auth')
export class AuthController {
  constructor(private readonly identityProxy: IdentityProxy) {}

  @Post('register')
  async register(@Body() registerData: RegisterUserDto) {
    return this.identityProxy.register(registerData)
  }

  @Post('login')
  async login(@Body() loginData: LoginUserDto) {
    return this.identityProxy.login(loginData)
  }
}