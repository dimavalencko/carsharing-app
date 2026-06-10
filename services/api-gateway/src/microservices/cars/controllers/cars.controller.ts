import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateCarDto, UpdateCarDto } from '@carsharing/common';
import { CarStatus } from '@carsharing/common';
import { CarCategory } from '@carsharing/common';
import { AdminGuard, JwtAuthGuard } from '@src/guards';
import { CarsProxy } from '../proxy/cars.proxy';

@Controller('cars')
export class CarsController {
  constructor(private readonly carsProxy: CarsProxy) {}

  @Get()
  async getAll(
    @Query('category') category?: CarCategory,
    @Query('city') city?: string,
    @Query('status') status?: CarStatus,
  ) {
    return this.carsProxy.getAll({ category, city, status });
  }

  @Get('available')
  async getAvailable(
    @Query('category') category?: CarCategory,
    @Query('city') city?: string,
  ) {
    return this.carsProxy.getAvailable({ category, city });
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.carsProxy.getById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateCarDto) {
    return this.carsProxy.create(dto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async update(@Param('id') id: string, @Body() dto: UpdateCarDto) {
    return this.carsProxy.update(id, dto);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: CarStatus,
  ) {
    return this.carsProxy.updateStatus(id, status);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    return this.carsProxy.delete(id);
  }
}
