import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { ServiceNames, BookingEndpoints, BookingResponseDto, CreateBookingDto } from '@carsharing/common';

@Injectable()
export class BookingProxy {
  constructor(
    @Inject(ServiceNames.BOOKING)
    private readonly bookingClient: ClientProxy,
  ) {}

  private async send<T>(pattern: string, data: unknown): Promise<T> {
    const result = await firstValueFrom(
      this.bookingClient.send<T>(pattern, data),
    );
    if (result && (result as any).error) {
      throw new Error((result as any).error);
    }
    return result;
  }

  async getAll(): Promise<BookingResponseDto[]> {
    return this.send<BookingResponseDto[]>(BookingEndpoints.BOOKING.GET_ALL, {});
  }

  async getById(id: string): Promise<BookingResponseDto> {
    return this.send<BookingResponseDto>(BookingEndpoints.BOOKING.GET_BY_ID, { id });
  }

  async getByUserId(userId: string): Promise<BookingResponseDto[]> {
    return this.send<BookingResponseDto[]>(BookingEndpoints.BOOKING.GET_BY_USER, { userId });
  }

  async getActiveByUserId(userId: string): Promise<BookingResponseDto | null> {
    return this.send<BookingResponseDto | null>(BookingEndpoints.BOOKING.GET_ACTIVE, { userId });
  }

  async create(dto: CreateBookingDto): Promise<BookingResponseDto> {
    return this.send<BookingResponseDto>(BookingEndpoints.BOOKING.CREATE, dto);
  }

  async confirm(id: string): Promise<BookingResponseDto> {
    return this.send<BookingResponseDto>(BookingEndpoints.BOOKING.CONFIRM, { id });
  }

  async cancel(id: string): Promise<BookingResponseDto> {
    return this.send<BookingResponseDto>(BookingEndpoints.BOOKING.CANCEL, { id });
  }

  async start(id: string): Promise<BookingResponseDto> {
    return this.send<BookingResponseDto>(BookingEndpoints.BOOKING.START, { id });
  }

  async complete(id: string): Promise<BookingResponseDto> {
    return this.send<BookingResponseDto>(BookingEndpoints.BOOKING.COMPLETE, { id });
  }
}
