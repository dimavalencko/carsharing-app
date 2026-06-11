import { Module } from '@nestjs/common';
import { MicroservicesModule } from '../microservices.module';
import { BookingController } from './controllers/booking.controller';
import { BookingProxy } from './proxy/booking.proxy';
import { JwtAuthGuard, AdminGuard } from '@src/guards';

@Module({
  imports: [MicroservicesModule],
  controllers: [BookingController],
  providers: [BookingProxy, JwtAuthGuard, AdminGuard],
})
export class BookingModule {}
