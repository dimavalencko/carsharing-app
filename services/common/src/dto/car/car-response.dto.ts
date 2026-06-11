import { CarCategory } from '../../enums/car-category.enum';
import { CarStatus } from '../../enums/car-status.enum';

export class CarResponseDto {
  id: string;
  brand: string;
  model: string;
  year: number;
  category: CarCategory;
  status: CarStatus;
  pricePerDay: number;
  licensePlate: string;
  city: string;
  vin?: string;
  color?: string;
  mileage?: number;
  imageUrl?: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}
