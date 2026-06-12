import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

function generateSlug(brand: string, model: string, year: number): string {
  return `${brand}-${model}-${year}`
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}
import type { ICarRepository, CarFilters } from '@/domain/interfaces/repositories/ICarRepository';
import { Car } from '@/domain/entities/car.entity';
import { CarStatus } from '@/domain/enums/car-status.enum';
import { CreateCarDto } from '../dto/create-car.dto';
import { UpdateCarDto } from '../dto/update-car.dto';

@Injectable()
export class CarsManagementService {
  constructor(
    @Inject('ICarRepository')
    private readonly carRepository: ICarRepository,
  ) {}

  async getAll(filters?: CarFilters): Promise<Car[]> {
    return this.carRepository.findAll(filters);
  }

  async getAvailable(filters?: Omit<CarFilters, 'status'>): Promise<Car[]> {
    return this.carRepository.findAvailable(filters);
  }

  async getById(id: string): Promise<Car> {
    const car = await this.carRepository.findById(id);
    if (!car) throw new NotFoundException(`Car ${id} not found`);
    return car;
  }

  async getBySlug(slug: string): Promise<Car> {
    const car = await this.carRepository.findBySlug(slug);
    if (!car) throw new NotFoundException(`Car with slug "${slug}" not found`);
    return car;
  }

  async create(dto: CreateCarDto): Promise<Car> {
    const baseSlug = generateSlug(dto.brand, dto.model, dto.year);
    let slug = baseSlug;
    let counter = 2;
    while (await this.carRepository.findBySlug(slug)) {
      slug = `${baseSlug}-${counter++}`;
    }

    const car = Car.create({
      id: uuidv4(),
      slug,
      brand: dto.brand,
      model: dto.model,
      year: dto.year,
      category: dto.category,
      status: CarStatus.Available,
      pricePerDay: dto.pricePerDay,
      licensePlate: dto.licensePlate,
      city: dto.city,
      vin: dto.vin,
      color: dto.color,
      mileage: dto.mileage,
      imageUrl: dto.imageUrl,
      description: dto.description,
    });
    return this.carRepository.save(car);
  }

  async update(id: string, dto: UpdateCarDto): Promise<Car> {
    const car = await this.carRepository.update(id, dto);
    if (!car) throw new NotFoundException(`Car ${id} not found`);
    return car;
  }

  async updateStatus(id: string, status: CarStatus): Promise<void> {
    const exists = await this.carRepository.findById(id);
    if (!exists) throw new NotFoundException(`Car ${id} not found`);
    await this.carRepository.updateStatus(id, status);
  }

  async delete(id: string): Promise<void> {
    const exists = await this.carRepository.findById(id);
    if (!exists) throw new NotFoundException(`Car ${id} not found`);
    await this.carRepository.delete(id);
  }
}
