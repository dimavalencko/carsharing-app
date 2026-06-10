import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { BookingEndpoints } from '@carsharing/common';
import { BookingManagementService } from '@/application/services/booking-management.service';
import { CreateBookingDto } from '@/application/dto/create-booking.dto';

@Controller()
export class BookingController {
  constructor(private readonly bookingService: BookingManagementService) {}

  @MessagePattern(BookingEndpoints.BOOKING.GET_ALL)
  async getAll() {
    try {
      return await this.bookingService.getAll();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return { error: message, statusCode: 500 };
    }
  }

  @MessagePattern(BookingEndpoints.BOOKING.GET_BY_ID)
  async getById(@Payload() data: { id: string }) {
    try {
      return await this.bookingService.getById(data.id);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return { error: message, statusCode: 404 };
    }
  }

  @MessagePattern(BookingEndpoints.BOOKING.GET_BY_USER)
  async getByUser(@Payload() data: { userId: string }) {
    try {
      return await this.bookingService.getByUserId(data.userId);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return { error: message, statusCode: 500 };
    }
  }

  @MessagePattern(BookingEndpoints.BOOKING.GET_ACTIVE)
  async getActive(@Payload() data: { userId: string }) {
    try {
      return await this.bookingService.getActiveByUserId(data.userId);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return { error: message, statusCode: 500 };
    }
  }

  @MessagePattern(BookingEndpoints.BOOKING.CREATE)
  async create(@Payload() data: CreateBookingDto) {
    try {
      return await this.bookingService.create(data);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return { error: message, statusCode: 400 };
    }
  }

  @MessagePattern(BookingEndpoints.BOOKING.CONFIRM)
  async confirm(@Payload() data: { id: string }) {
    try {
      return await this.bookingService.confirm(data.id);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return { error: message, statusCode: 400 };
    }
  }

  @MessagePattern(BookingEndpoints.BOOKING.CANCEL)
  async cancel(@Payload() data: { id: string }) {
    try {
      return await this.bookingService.cancel(data.id);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return { error: message, statusCode: 400 };
    }
  }

  @MessagePattern(BookingEndpoints.BOOKING.START)
  async start(@Payload() data: { id: string }) {
    try {
      return await this.bookingService.start(data.id);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return { error: message, statusCode: 400 };
    }
  }

  @MessagePattern(BookingEndpoints.BOOKING.COMPLETE)
  async complete(@Payload() data: { id: string }) {
    try {
      return await this.bookingService.complete(data.id);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return { error: message, statusCode: 400 };
    }
  }

  @MessagePattern(BookingEndpoints.HEALTH.CHECK)
  health() {
    return { status: 'ok', service: 'booking' };
  }
}
