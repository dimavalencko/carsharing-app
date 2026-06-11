export type BookingStatus = 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled';

export interface Booking {
  id: string;
  userId: string;
  carId: string;
  startDate: string;
  endDate: string;
  status: BookingStatus;
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookingDto {
  carId: string;
  startDate: string;
  endDate: string;
}
