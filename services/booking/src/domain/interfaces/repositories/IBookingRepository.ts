import { Booking } from '../../entities/booking.entity';
import { BookingStatus } from '../../enums/booking-status.enum';

export interface IBookingRepository {
  findById(id: string): Promise<Booking | null>;
  findAll(): Promise<Booking[]>;
  findByUserId(userId: string): Promise<Booking[]>;
  findActiveByUserId(userId: string): Promise<Booking | null>;
  save(booking: Booking): Promise<Booking>;
  updateStatus(id: string, status: BookingStatus): Promise<void>;
  delete(id: string): Promise<void>;
}
