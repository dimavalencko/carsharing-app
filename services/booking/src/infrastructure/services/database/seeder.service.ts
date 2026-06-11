import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { BookingEntity } from '@/infrastructure/persistence/typeorm/entities/booking.entity';
import { BOOKINGS_SEED_DATA } from './data/bookings.data';

@Injectable()
export class BookingSeederService implements OnModuleInit {
  private readonly logger = new Logger(BookingSeederService.name);

  constructor(
    private readonly dataSource: DataSource,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    if (this.configService.get<string>('AUTO_SEED', 'true') !== 'true') return;
    await this.seed();
  }

  async seed(): Promise<void> {
    const repo = this.dataSource.getRepository(BookingEntity);
    const count = await repo.count();
    if (count > 0) {
      this.logger.log(`Bookings table already has ${count} rows — skipping seed.`);
      return;
    }

    this.logger.log(`Seeding ${BOOKINGS_SEED_DATA.length} bookings...`);
    await repo.insert(BOOKINGS_SEED_DATA);
    this.logger.log(`✅ Seeded ${BOOKINGS_SEED_DATA.length} bookings.`);
  }
}
