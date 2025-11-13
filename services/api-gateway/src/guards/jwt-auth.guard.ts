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
    const authHeader = request.headers['authorization'];

    if (!authHeader) {
      throw new UnauthorizedException('No authorization header');
    }

    const token = authHeader.split(' ')[1];
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

      // Декодируем JWT токен вручную (без проверки подписи, т.к. проверку делает Identity)
      const payload = this.decodeJwt(token);
      
      console.log('Decoded JWT payload:', JSON.stringify(payload, null, 2));

      // Сохраняем декодированные данные в request.user
      request.user = payload;
      return true;
    } catch (error) {
      console.error('Token verification failed:', error);
      throw new UnauthorizedException('Token verification failed');
    }
  }

  // Простой декодер JWT (только декодирование, без проверки подписи)
  private decodeJwt(token: string): any {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error('Invalid token format');
      }

      // Декодируем payload (вторая часть токена)
      const payload = Buffer.from(parts[1], 'base64').toString('utf-8');
      return JSON.parse(payload);
    } catch (error) {
      throw new UnauthorizedException('Failed to decode token');
    }
  }
}