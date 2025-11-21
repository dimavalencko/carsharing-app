import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { AdminController } from '@/infrastructure/controllers/admin.controller';
import { AdminManagementService } from '@/application/services/admin-management.service';
import type { IUserRepository } from '@/domain/interfaces/repositories';
import type { IPasswordHasher } from '@/domain/interfaces/services';

@Module({
  imports: [DatabaseModule],
  controllers: [AdminController],
  providers: [
    {
      provide: 'AdminManagementService',
      useFactory: (
        userRepository: IUserRepository,
        passwordHasher: IPasswordHasher,
      ) => {
        return new AdminManagementService(userRepository, passwordHasher);
      },
      inject: ['IUserRepository', 'IPasswordHasher'],
    },
  ],
  exports: ['AdminManagementService'],
})
export class AdminModule {}
