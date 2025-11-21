import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { ClientProxy } from '@nestjs/microservices';
import { ServiceNames, IdentityEndpoints } from '@carsharing/common';
import { firstValueFrom } from 'rxjs';

/**
 * Интерцептор для автоматического обновления токена при истечении accessToken
 * Если получаем 401 ошибку, пытаемся обновить токен используя refreshToken из cookies
 */
@Injectable()
export class RefreshTokenInterceptor implements NestInterceptor {
  constructor(
    @Inject(ServiceNames.IDENTITY)
    private readonly identityClient: ClientProxy,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    return next.handle().pipe(
      catchError((error) => {
        // Если ошибка не 401 или это запрос на refresh - пробрасываем дальше
        if (
          error.status !== 401 ||
          request.path?.includes('/refresh') ||
          request.path?.includes('/login') ||
          request.path?.includes('/register')
        ) {
          return throwError(() => error);
        }

        const refreshToken = request.cookies?.refreshToken;
        
        if (!refreshToken) {
          return throwError(() => new UnauthorizedException('Session expired'));
        }

        return this.refreshTokens(refreshToken, response, request, context, next);
      }),
    );
  }

  private refreshTokens(
    refreshToken: string,
    response: any,
    request: any,
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> {
    return new Observable((observer) => {
      firstValueFrom(
        this.identityClient.send(IdentityEndpoints.AUTH.REFRESH, {
          refreshToken,
        }),
      )
        .then((result) => {
          if (result.error) {
            observer.error(new UnauthorizedException('Failed to refresh token'));
            return;
          }

          this.setAuthCookies(response, result.accessToken, result.refreshToken);
          
          request.cookies.accessToken = result.accessToken;

          next.handle().subscribe({
            next: (data) => observer.next(data),
            error: (err) => observer.error(err),
            complete: () => observer.complete(),
          });
        })
        .catch((err) => {
          observer.error(new UnauthorizedException('Session expired'));
        });
    });
  }

  private setAuthCookies(res: any, accessToken: string, refreshToken: string) {
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict' as const,
      path: '/',
    };

    res.cookie('accessToken', accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000, // 15 минут
    });

    res.cookie('refreshToken', refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 дней
    });
  }
}
