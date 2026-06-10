import { Booking } from '@/domain/entities/booking.entity';
import { BookingStatus } from '@/domain/enums/booking-status.enum';
import { BookingEntity } from '../entities/booking.entity';

export class BookingMapper {
  static toDomain(entity: BookingEntity): Booking {
    const booking = new Booking();
    booking.id = entity.id;
    booking.userId = entity.userId;
    booking.carId = entity.carId;
    booking.startDate = entity.startDate;
    booking.endDate = entity.endDate;
    booking.status = entity.status as BookingStatus;
    booking.totalPrice = Number(entity.totalPrice);
    booking.createdAt = entity.createdAt;
    booking.updatedAt = entity.updatedAt;
    return booking;
  }

  static toPersistence(booking: Booking): BookingEntity {
    const entity = new BookingEntity();
    entity.id = booking.id;
    entity.userId = booking.userId;
    entity.carId = booking.carId;
    entity.startDate = booking.startDate;
    entity.endDate = booking.endDate;
    entity.status = booking.status;
    entity.totalPrice = booking.totalPrice;
    return entity;
  }
}
