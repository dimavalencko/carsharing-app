import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CarsEndpoints } from '@carsharing/common';
import { CarsManagementService } from '@/application/services/cars-management.service';
import { CreateCarDto } from '@/application/dto/create-car.dto';
import { UpdateCarDto } from '@/application/dto/update-car.dto';
import { CarStatus } from '@/domain/enums/car-status.enum';
import { CarCategory } from '@/domain/enums/car-category.enum';

@Controller()
export class CarsController {
  constructor(private readonly carsService: CarsManagementService) {}

  @MessagePattern(CarsEndpoints.CARS.GET_ALL)
  async getAll(@Payload() data: { category?: CarCategory; city?: string; status?: CarStatus }) {
    try {
      return await this.carsService.getAll(data);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return { error: message, statusCode: 500 };
    }
  }

  @MessagePattern(CarsEndpoints.CARS.GET_AVAILABLE)
  async getAvailable(@Payload() data: { category?: CarCategory; city?: string }) {
    try {
      return await this.carsService.getAvailable(data);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return { error: message, statusCode: 500 };
    }
  }

  @MessagePattern(CarsEndpoints.CARS.GET_BY_ID)
  async getById(@Payload() data: { id: string }) {
    try {
      return await this.carsService.getById(data.id);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return { error: message, statusCode: 404 };
    }
  }

  @MessagePattern(CarsEndpoints.CARS.GET_BY_SLUG)
  async getBySlug(@Payload() data: { slug: string }) {
    try {
      return await this.carsService.getBySlug(data.slug);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return { error: message, statusCode: 404 };
    }
  }

  @MessagePattern(CarsEndpoints.CARS.CREATE)
  async create(@Payload() data: CreateCarDto) {
    try {
      return await this.carsService.create(data);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return { error: message, statusCode: 400 };
    }
  }

  @MessagePattern(CarsEndpoints.CARS.UPDATE)
  async update(@Payload() data: { id: string; dto: UpdateCarDto }) {
    try {
      return await this.carsService.update(data.id, data.dto);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return { error: message, statusCode: 400 };
    }
  }

  @MessagePattern(CarsEndpoints.CARS.UPDATE_STATUS)
  async updateStatus(@Payload() data: { id: string; status: CarStatus }) {
    try {
      await this.carsService.updateStatus(data.id, data.status);
      return { success: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return { error: message, statusCode: 400 };
    }
  }

  @MessagePattern(CarsEndpoints.CARS.DELETE)
  async delete(@Payload() data: { id: string }) {
    try {
      await this.carsService.delete(data.id);
      return { success: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return { error: message, statusCode: 400 };
    }
  }

  @MessagePattern(CarsEndpoints.HEALTH.CHECK)
  health() {
    return { status: 'ok', service: 'cars' };
  }
}
