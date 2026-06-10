import { Repository } from 'typeorm';
import { Car } from '@/domain/entities/car.entity';
import { CarStatus } from '@/domain/enums/car-status.enum';
import { CarFilters, ICarRepository } from '@/domain/interfaces/repositories/ICarRepository';
import { CarEntity } from '../entities/car.entity';
import { CarMapper } from '../mappers/car.mapper';

export class CarRepository implements ICarRepository {
  constructor(private readonly ormRepo: Repository<CarEntity>) {}

  async findById(id: string): Promise<Car | null> {
    const entity = await this.ormRepo.findOne({ where: { id } });
    return entity ? CarMapper.toDomain(entity) : null;
  }

  async findAll(filters?: CarFilters): Promise<Car[]> {
    const where: Record<string, unknown> = {};
    if (filters?.category) where.category = filters.category;
    if (filters?.city) where.city = filters.city;
    if (filters?.status) where.status = filters.status;

    const entities = await this.ormRepo.find({ where });
    return entities.map(CarMapper.toDomain);
  }

  async findAvailable(filters?: Omit<CarFilters, 'status'>): Promise<Car[]> {
    const where: Record<string, unknown> = { status: CarStatus.Available };
    if (filters?.category) where.category = filters.category;
    if (filters?.city) where.city = filters.city;

    const entities = await this.ormRepo.find({ where });
    return entities.map(CarMapper.toDomain);
  }

  async save(car: Car): Promise<Car> {
    const entity = CarMapper.toPersistence(car);
    const saved = await this.ormRepo.save(entity);
    return CarMapper.toDomain(saved);
  }

  async update(id: string, partial: Partial<Car>): Promise<Car | null> {
    await this.ormRepo.update({ id }, partial as Partial<CarEntity>);
    return this.findById(id);
  }

  async updateStatus(id: string, status: CarStatus): Promise<void> {
    await this.ormRepo.update({ id }, { status });
  }

  async delete(id: string): Promise<void> {
    await this.ormRepo.delete({ id });
  }

  async existsByLicensePlate(licensePlate: string): Promise<boolean> {
    const count = await this.ormRepo.count({ where: { licensePlate } });
    return count > 0;
  }
}
