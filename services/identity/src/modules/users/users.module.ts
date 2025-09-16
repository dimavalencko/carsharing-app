// users.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from '@infrastructure/controllers/users.controller';
import { UsersService } from '@infrastructure/services/users.service';
import { User, Profile } from '@domain/entities';
import { UserRepository } from '@/infrastructure/repositories/user.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Profile]),
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    {
      provide: 'IUserRepository',
      useClass: UserRepository,
    },
  ],
  exports: [
    UsersService,
    {
      provide: 'IUserRepository',
      useClass: UserRepository,
    },
  ]
})
export class UsersModule {}