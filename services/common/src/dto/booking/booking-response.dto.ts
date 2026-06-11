import { BookingStatus } from '../../enums/booking-status.enum';

export class BookingResponseDto {
  id: string;
  userId: string;
  carId: string;
  startDate: Date;
  endDate: Date;
  status: BookingStatus;
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;
}
