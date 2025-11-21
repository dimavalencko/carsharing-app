import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ServiceNames, IdentityEndpoints } from '@carsharing/common';
import { firstValueFrom } from 'rxjs';

@Controller('identity/health')
export class HealthController {
  constructor(
    @Inject(ServiceNames.IDENTITY) private readonly identityClient: ClientProxy,
  ) {}

  @Get()
  async checkHealth() {
    return await firstValueFrom(
      this.identityClient.send(IdentityEndpoints.HEALTH.CHECK, {}),
    );
  }

  @Get('db')
  async checkDatabase() {
    return await firstValueFrom(
      this.identityClient.send(IdentityEndpoints.HEALTH.CHECK_DB, {}),
    );
  }
}