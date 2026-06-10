import { BookingStatus } from '../enums/booking-status.enum';

export class Booking {
  id: string;
  userId: string;
  carId: string;
  startDate: Date;
  endDate: Date;
  status: BookingStatus;
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;

  static create(props: Omit<Booking, 'createdAt' | 'updatedAt'>): Booking {
    const booking = new Booking();
    Object.assign(booking, props);
    booking.createdAt = new Date();
    booking.updatedAt = new Date();
    return booking;
  }

  get durationDays(): number {
    const ms = this.endDate.getTime() - this.startDate.getTime();
    return Math.max(1, Math.ceil(ms / (1000 * 60 * 60 * 24)));
  }
}
