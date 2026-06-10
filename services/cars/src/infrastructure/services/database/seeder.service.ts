import { Injectable, Inject, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { CarEntity } from '@/infrastructure/persistence/typeorm/entities/car.entity';
import { CARS_SEED_DATA } from './data/cars.data';

@Injectable()
export class CarsSeederService implements OnModuleInit {
  private readonly logger = new Logger(CarsSeederService.name);

  constructor(
    private readonly dataSource: DataSource,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    if (this.configService.get<string>('AUTO_SEED', 'true') !== 'true') return;
    await this.seed();
  }

  async seed(): Promise<void> {
    const repo = this.dataSource.getRepository(CarEntity);
    const count = await repo.count();
    if (count > 0) {
      this.logger.log(`Cars table already has ${count} rows — skipping seed.`);
      return;
    }

    this.logger.log(`Seeding ${CARS_SEED_DATA.length} cars...`);
    await repo.insert(CARS_SEED_DATA);
    this.logger.log(`✅ Seeded ${CARS_SEED_DATA.length} cars.`);
  }
}
