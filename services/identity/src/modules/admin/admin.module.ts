import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { AdminController } from '@/infrastructure/controllers/admin.controller';
import { AdminManagementService } from '@/application/services/admin-management.service';

@Module({
  imports: [DatabaseModule],
  controllers: [AdminController],
  providers: [
    {
      provide: 'AdminManagementService',
      useClass: AdminManagementService,
    },
  ],
  exports: ['AdminManagementService'],
})
export class AdminModule {}
