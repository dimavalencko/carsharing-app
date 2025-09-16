// auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from '@infrastructure/controllers/auth.controller';
import { AuthService } from '@infrastructure/services/auth.service';
import { UserRepository } from '@infrastructure/repositories/user.repository';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User, RefreshToken } from '@domain/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, RefreshToken]),
    
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'fallbackSecret',
        signOptions: { expiresIn: `${configService.get<string>('JWT_EXPIRES_IN')}m` || '15m' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: 'IUserRepository',
      useClass: UserRepository,
    },
  ],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}