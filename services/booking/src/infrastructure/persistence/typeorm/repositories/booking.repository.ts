import { In, Repository } from 'typeorm';
import { Booking } from '@/domain/entities/booking.entity';
import { BookingStatus } from '@/domain/enums/booking-status.enum';
import { IBookingRepository } from '@/domain/interfaces/repositories/IBookingRepository';
import { BookingEntity } from '../entities/booking.entity';
import { BookingMapper } from '../mappers/booking.mapper';

export class BookingRepository implements IBookingRepository {
  constructor(private readonly ormRepo: Repository<BookingEntity>) {}

  async findById(id: string): Promise<Booking | null> {
    const entity = await this.ormRepo.findOne({ where: { id } });
    return entity ? BookingMapper.toDomain(entity) : null;
  }

  async findAll(): Promise<Booking[]> {
    const entities = await this.ormRepo.find({ order: { createdAt: 'DESC' } });
    return entities.map(BookingMapper.toDomain);
  }

  async findByUserId(userId: string): Promise<Booking[]> {
    const entities = await this.ormRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
    return entities.map(BookingMapper.toDomain);
  }

  async findActiveByUserId(userId: string): Promise<Booking | null> {
    const entity = await this.ormRepo.findOne({
      where: {
        userId,
        status: In([BookingStatus.Confirmed, BookingStatus.Active]),
      },
    });
    return entity ? BookingMapper.toDomain(entity) : null;
  }

  async save(booking: Booking): Promise<Booking> {
    const entity = BookingMapper.toPersistence(booking);
    const saved = await this.ormRepo.save(entity);
    return BookingMapper.toDomain(saved);
  }

  async updateStatus(id: string, status: BookingStatus): Promise<void> {
    await this.ormRepo.update({ id }, { status });
  }

  async delete(id: string): Promise<void> {
    await this.ormRepo.delete({ id });
  }
}
