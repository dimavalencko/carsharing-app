import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { ServiceNames, CarsEndpoints, CarResponseDto, CreateCarDto, UpdateCarDto } from '@carsharing/common';
import { CarStatus } from '@carsharing/common';
import { CarCategory } from '@carsharing/common';

@Injectable()
export class CarsProxy {
  constructor(
    @Inject(ServiceNames.CARS)
    private readonly carsClient: ClientProxy,
  ) {}

  private async send<T>(pattern: string, data: unknown): Promise<T> {
    const result = await firstValueFrom(
      this.carsClient.send<T>(pattern, data),
    );
    if (result && (result as any).error) {
      throw new Error((result as any).error);
    }
    return result;
  }

  async getAll(filters: { category?: CarCategory; city?: string; status?: CarStatus }): Promise<CarResponseDto[]> {
    return this.send<CarResponseDto[]>(CarsEndpoints.CARS.GET_ALL, filters);
  }

  async getAvailable(filters: { category?: CarCategory; city?: string }): Promise<CarResponseDto[]> {
    return this.send<CarResponseDto[]>(CarsEndpoints.CARS.GET_AVAILABLE, filters);
  }

  async getById(id: string): Promise<CarResponseDto> {
    return this.send<CarResponseDto>(CarsEndpoints.CARS.GET_BY_ID, { id });
  }

  async create(dto: CreateCarDto): Promise<CarResponseDto> {
    return this.send<CarResponseDto>(CarsEndpoints.CARS.CREATE, dto);
  }

  async update(id: string, dto: UpdateCarDto): Promise<CarResponseDto> {
    return this.send<CarResponseDto>(CarsEndpoints.CARS.UPDATE, { id, dto });
  }

  async updateStatus(id: string, status: CarStatus): Promise<{ success: boolean }> {
    return this.send<{ success: boolean }>(CarsEndpoints.CARS.UPDATE_STATUS, { id, status });
  }

  async delete(id: string): Promise<{ success: boolean }> {
    return this.send<{ success: boolean }>(CarsEndpoints.CARS.DELETE, { id });
  }
}
