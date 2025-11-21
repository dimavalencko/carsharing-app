import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ServiceNames, IdentityEndpoints } from '@carsharing/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    @Inject(ServiceNames.IDENTITY) private readonly identityClient: ClientProxy,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    
    let token = request.cookies?.accessToken;
    
    if (!token) {
      const authHeader = request.headers['authorization'];
      if (authHeader) {
        token = authHeader.split(' ')[1];
      }
    }

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const result = await firstValueFrom(
        this.identityClient.send(IdentityEndpoints.AUTH.VALIDATE_TOKEN, {
          accessToken: token,
        }),
      );

      if (result.error || !result.valid) {
        throw new UnauthorizedException(result.error || 'Invalid token');
      }

      const payload = this.decodeJwt(token);
      
      request.user = payload;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Token verification failed');
    }
  }

  private decodeJwt(token: string): any {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error('Invalid token format');
      }

      const payload = Buffer.from(parts[1], 'base64').toString('utf-8');
      return JSON.parse(payload);
    } catch (error) {
      throw new UnauthorizedException('Failed to decode token');
    }
  }
}