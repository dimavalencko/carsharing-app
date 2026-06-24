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
      this.logger.log(`Cars table already has ${count} rows — updating seed data...`);
      await this.backfillSlugs(repo);
      await this.backfillImages(repo);
      return;
    }

    this.logger.log(`Seeding ${CARS_SEED_DATA.length} cars...`);
    await repo.insert(CARS_SEED_DATA);
    this.logger.log(`✅ Seeded ${CARS_SEED_DATA.length} cars.`);
  }

  private async backfillSlugs(repo: any): Promise<void> {
    const missing = await repo
      .createQueryBuilder('car')
      .where('car.slug IS NULL')
      .getMany();
    if (missing.length === 0) return;

    this.logger.log(`Backfilling slugs for ${missing.length} cars...`);
    for (const car of missing) {
      const seed = CARS_SEED_DATA.find(s => s.id === car.id);
      if (seed?.slug) {
        await repo.update(car.id, { slug: seed.slug });
      }
    }
    this.logger.log(`✅ Slugs backfilled.`);
  }

  private async backfillImages(repo: any): Promise<void> {
    const cars = await repo.find();
    let updated = 0;
    for (const car of cars) {
      const seed = CARS_SEED_DATA.find(s => s.id === car.id);
      if (seed?.imageUrl && seed.imageUrl !== car.imageUrl) {
        await repo.update(car.id, { imageUrl: seed.imageUrl });
        updated++;
      }
    }
    if (updated > 0) {
      this.logger.log(`✅ Updated imageUrl for ${updated} cars.`);
    }
  }
}
