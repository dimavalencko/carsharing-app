import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';
import { IdentityEndpoints, ServiceNames } from '@carsharing/common';
import { LoginUserDto, TokensDto } from '@carsharing/common';
import { firstValueFrom } from 'rxjs';

@Controller('identity/auth')
export class AuthController {
  constructor(
    @Inject(ServiceNames.IDENTITY) private readonly identityClient: ClientProxy,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginUserDto: LoginUserDto): Promise<TokensDto> {
    return firstValueFrom(
      this.identityClient.send<TokensDto, LoginUserDto>(
        IdentityEndpoints.AUTH.LOGIN,
        loginUserDto,
      ),
    );
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body('refreshToken') refreshToken: string): Promise<TokensDto> {
    return firstValueFrom(
      this.identityClient.send<TokensDto, { refreshToken: string }>(
        IdentityEndpoints.AUTH.REFRESH,
        { refreshToken },
      ),
    );
  }

  // @Post('logout')
  // @HttpCode(HttpStatus.OK)
  // async logout(@Body('userId') userId: string): Promise<void> {
  //   return firstValueFrom(
  //     this.identityClient.send<void, { userId: string }>(
  //       IdentityEndpoints.AUTH.LOGOUT,
  //       { userId },
  //     ),
  //   );
  // }
}