import { Module } from '@nestjs/common';
import { CarsController } from '@/infrastructure/controllers/cars.controller';
import { CarsManagementService } from '@/application/services/cars-management.service';

@Module({
  controllers: [CarsController],
  providers: [CarsManagementService],
})
export class CarsModule {}
