export type CarCategory = 'economy' | 'comfort' | 'business' | 'premium';
export type CarStatus = 'available' | 'rented' | 'reserved' | 'maintenance';

export interface Car {
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
  createdAt: string;
  updatedAt: string;
}

export interface CreateCarDto {
  brand: string;
  model: string;
  year: number;
  category: CarCategory;
  pricePerDay: number;
  licensePlate: string;
  city: string;
  vin?: string;
  color?: string;
  mileage?: number;
  imageUrl?: string;
  description?: string;
}

export interface UpdateCarDto {
  brand?: string;
  model?: string;
  year?: number;
  category?: CarCategory;
  status?: CarStatus;
  pricePerDay?: number;
  licensePlate?: string;
  city?: string;
  vin?: string;
  color?: string;
  mileage?: number;
  imageUrl?: string;
  description?: string;
}
