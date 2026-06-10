import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { CarsEndpoints, CarResponseDto, ServiceNames } from '@carsharing/common';

@Injectable()
export class CarsClientService {
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

  async getCarById(id: string): Promise<CarResponseDto> {
    return this.send<CarResponseDto>(CarsEndpoints.CARS.GET_BY_ID, { id });
  }

  async updateCarStatus(id: string, status: string): Promise<void> {
    await this.send(CarsEndpoints.CARS.UPDATE_STATUS, { id, status });
  }
}
