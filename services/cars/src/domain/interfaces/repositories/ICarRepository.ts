import { Car } from '../../entities/car.entity';
import { CarStatus } from '../../enums/car-status.enum';
import { CarCategory } from '../../enums/car-category.enum';

export interface CarFilters {
  category?: CarCategory;
  city?: string;
  status?: CarStatus;
}

export interface ICarRepository {
  findById(id: string): Promise<Car | null>;
  findAll(filters?: CarFilters): Promise<Car[]>;
  findAvailable(filters?: Omit<CarFilters, 'status'>): Promise<Car[]>;
  save(car: Car): Promise<Car>;
  update(id: string, car: Partial<Car>): Promise<Car | null>;
  updateStatus(id: string, status: CarStatus): Promise<void>;
  delete(id: string): Promise<void>;
  existsByLicensePlate(licensePlate: string): Promise<boolean>;
}
