import { defaultHttpClient } from '@/app/axios/defaultHttpClient';
import type { Car, CarCategory, CarStatus, CreateCarDto, UpdateCarDto } from '@/shared/types';

export interface CarsFilters {
  category?: CarCategory;
  city?: string;
  status?: CarStatus;
}

export const carsService = {
  async getAll(filters?: CarsFilters): Promise<Car[]> {
    const { data } = await defaultHttpClient.get<Car[]>('/cars', { params: filters });
    return data;
  },

  async getAvailable(filters?: Omit<CarsFilters, 'status'>): Promise<Car[]> {
    const { data } = await defaultHttpClient.get<Car[]>('/cars/available', { params: filters });
    return data;
  },

  async getById(id: string): Promise<Car> {
    const { data } = await defaultHttpClient.get<Car>(`/cars/${id}`);
    return data;
  },

  async create(dto: CreateCarDto): Promise<Car> {
    const { data } = await defaultHttpClient.post<Car>('/cars', dto);
    return data;
  },

  async update(id: string, dto: UpdateCarDto): Promise<Car> {
    const { data } = await defaultHttpClient.put<Car>(`/cars/${id}`, dto);
    return data;
  },

  async updateStatus(id: string, status: CarStatus): Promise<void> {
    await defaultHttpClient.patch(`/cars/${id}/status`, { status });
  },

  async delete(id: string): Promise<void> {
    await defaultHttpClient.delete(`/cars/${id}`);
  },
};
