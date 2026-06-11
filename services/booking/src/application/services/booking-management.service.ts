import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CarStatus } from '@carsharing/common';
import { Booking } from '@/domain/entities/booking.entity';
import { BookingStatus } from '@/domain/enums/booking-status.enum';
import type { IBookingRepository } from '@/domain/interfaces/repositories/IBookingRepository';
import { CarsClientService } from './cars-client.service';
import { CreateBookingDto } from '../dto/create-booking.dto';

@Injectable()
export class BookingManagementService {
  constructor(
    @Inject('IBookingRepository')
    private readonly bookingRepository: IBookingRepository,
    private readonly carsClient: CarsClientService,
  ) {}

  async getAll(): Promise<Booking[]> {
    return this.bookingRepository.findAll();
  }

  async getById(id: string): Promise<Booking> {
    const booking = await this.bookingRepository.findById(id);
    if (!booking) throw new NotFoundException(`Booking ${id} not found`);
    return booking;
  }

  async getByUserId(userId: string): Promise<Booking[]> {
    return this.bookingRepository.findByUserId(userId);
  }

  async getActiveByUserId(userId: string): Promise<Booking | null> {
    return this.bookingRepository.findActiveByUserId(userId);
  }

  async create(dto: CreateBookingDto): Promise<Booking> {
    const startDate = new Date(dto.startDate);
    const endDate = new Date(dto.endDate);

    if (endDate <= startDate) {
      throw new BadRequestException('End date must be after start date');
    }

    const car = await this.carsClient.getCarById(dto.carId);

    if (car.status !== CarStatus.Available) {
      throw new BadRequestException(`Car is not available (status: ${car.status})`);
    }

    const durationDays = Math.max(1, Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
    ));
    const totalPrice = durationDays * car.pricePerDay;

    const booking = Booking.create({
      id: uuidv4(),
      userId: dto.userId,
      carId: dto.carId,
      startDate,
      endDate,
      status: BookingStatus.Pending,
      totalPrice,
    });

    return this.bookingRepository.save(booking);
  }

  async confirm(id: string): Promise<Booking> {
    const booking = await this.getById(id);

    if (booking.status !== BookingStatus.Pending) {
      throw new BadRequestException(`Cannot confirm booking with status: ${booking.status}`);
    }

    await this.carsClient.updateCarStatus(booking.carId, CarStatus.Reserved);
    await this.bookingRepository.updateStatus(id, BookingStatus.Confirmed);

    return this.getById(id);
  }

  async cancel(id: string): Promise<Booking> {
    const booking = await this.getById(id);

    if (booking.status === BookingStatus.Completed || booking.status === BookingStatus.Cancelled) {
      throw new BadRequestException(`Cannot cancel booking with status: ${booking.status}`);
    }

    const wasReservedOrActive =
      booking.status === BookingStatus.Confirmed ||
      booking.status === BookingStatus.Active;

    if (wasReservedOrActive) {
      await this.carsClient.updateCarStatus(booking.carId, CarStatus.Available);
    }

    await this.bookingRepository.updateStatus(id, BookingStatus.Cancelled);
    return this.getById(id);
  }

  async start(id: string): Promise<Booking> {
    const booking = await this.getById(id);

    if (booking.status !== BookingStatus.Confirmed) {
      throw new BadRequestException(`Cannot start booking with status: ${booking.status}`);
    }

    await this.carsClient.updateCarStatus(booking.carId, CarStatus.Rented);
    await this.bookingRepository.updateStatus(id, BookingStatus.Active);

    return this.getById(id);
  }

  async complete(id: string): Promise<Booking> {
    const booking = await this.getById(id);

    if (booking.status !== BookingStatus.Active) {
      throw new BadRequestException(`Cannot complete booking with status: ${booking.status}`);
    }

    await this.carsClient.updateCarStatus(booking.carId, CarStatus.Available);
    await this.bookingRepository.updateStatus(id, BookingStatus.Completed);

    return this.getById(id);
  }
}
