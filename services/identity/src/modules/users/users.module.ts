import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { UsersController } from '@/infrastructure/controllers/users.controller';
import { UsersManagementService } from '@/application/services/users-management.service';
import type { IUserRepository } from '@/domain/interfaces/IUserRepository';
import type { IPasswordHasher } from '@/domain/interfaces/services/IPasswordHasher';

@Module({
  imports: [DatabaseModule],
  controllers: [UsersController],
  providers: [
    {
      provide: 'UsersManagementService',
      useFactory: (
        userRepository: IUserRepository,
        passwordHasher: IPasswordHasher,
      ) => {
        return new UsersManagementService(userRepository, passwordHasher);
      },
      inject: ['IUserRepository', 'IPasswordHasher'],
    },
  ],
  exports: ['UsersManagementService'],
})
export class UsersModule {}
