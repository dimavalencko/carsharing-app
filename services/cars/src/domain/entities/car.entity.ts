import { CarCategory } from '../enums/car-category.enum';
import { CarStatus } from '../enums/car-status.enum';

export class Car {
  id: string;
  brand: string;
  model: string;
  year: number;
  category: CarCategory;
  status: CarStatus;
  pricePerDay: number;
  licensePlate: string;
  city: string;
  slug?: string;
  vin?: string;
  color?: string;
  mileage?: number;
  imageUrl?: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;

  static create(props: Omit<Car, 'createdAt' | 'updatedAt'>): Car {
    const car = new Car();
    Object.assign(car, props);
    car.status = props.status ?? CarStatus.Available;
    car.createdAt = new Date();
    car.updatedAt = new Date();
    return car;
  }
}
