import { Module } from '@nestjs/common';
import { MicroservicesModule } from '../microservices.module';
import { CarsController } from './controllers/cars.controller';
import { CarsProxy } from './proxy/cars.proxy';
import { JwtAuthGuard, AdminGuard } from '@src/guards';

@Module({
  imports: [MicroservicesModule],
  controllers: [CarsController],
  providers: [CarsProxy, JwtAuthGuard, AdminGuard],
})
export class CarsModule {}
