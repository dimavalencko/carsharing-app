import { Car } from '@/domain/entities/car.entity';
import { CarCategory } from '@/domain/enums/car-category.enum';
import { CarStatus } from '@/domain/enums/car-status.enum';
import { CarEntity } from '../entities/car.entity';

export class CarMapper {
  static toDomain(entity: CarEntity): Car {
    const car = new Car();
    car.id = entity.id;
    car.brand = entity.brand;
    car.model = entity.model;
    car.year = entity.year;
    car.category = entity.category as CarCategory;
    car.status = entity.status as CarStatus;
    car.pricePerDay = Number(entity.pricePerDay);
    car.licensePlate = entity.licensePlate;
    car.city = entity.city;
    car.slug = entity.slug;
    car.vin = entity.vin;
    car.color = entity.color;
    car.mileage = entity.mileage;
    car.imageUrl = entity.imageUrl;
    car.description = entity.description;
    car.createdAt = entity.createdAt;
    car.updatedAt = entity.updatedAt;
    return car;
  }

  static toPersistence(car: Car): CarEntity {
    const entity = new CarEntity();
    entity.id = car.id;
    entity.brand = car.brand;
    entity.model = car.model;
    entity.year = car.year;
    entity.category = car.category;
    entity.status = car.status;
    entity.pricePerDay = car.pricePerDay;
    entity.licensePlate = car.licensePlate;
    entity.city = car.city;
    entity.slug = car.slug;
    entity.vin = car.vin;
    entity.color = car.color;
    entity.mileage = car.mileage;
    entity.imageUrl = car.imageUrl;
    entity.description = car.description;
    return entity;
  }
}
