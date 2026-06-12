import { Injectable, Inject, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import { SEED_USER_IDS } from '@carsharing/common';

import { User } from '@/domain/entities/user.entity';
import { DriverLicense } from '@/domain/entities/driver-license.entity';
import { UserAggregate } from '@/domain/aggregates/user';

import type {
  IUserRepository,
  IDriverLicenseRepository,
} from '@/domain/interfaces/repositories';
import type { IPasswordHasher } from '@/domain/interfaces/services';

import {
  LoginValue,
  PasswordValue,
  DriverLicenseNumberValue,
} from '@/domain/value-objects';

@Injectable()
export class SeederService implements OnModuleInit {
  private readonly logger = new Logger(SeederService.name);

  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    @Inject('IDriverLicenseRepository')
    private readonly driverLicenseRepository: IDriverLicenseRepository,
    @Inject('IPasswordHasher')
    private readonly passwordHasher: IPasswordHasher,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    const autoSeed =
      this.configService.get<string>('AUTO_SEED', 'true') === 'true';
    if (!autoSeed) {
      this.logger.log('AUTO_SEED is disabled. Skipping seeding.');
      return;
    }

    await this.seedAll();
  }

  async seedAll(): Promise<void> {
    this.logger.log('Starting database seeding...');
    await this.seedDefaultAdmin();
    await this.seedTestUsers(5);
    await this.seedDriverLicensesForSomeUsers();
    this.logger.log('Database seeding completed.');
  }

  private async seedDefaultAdmin(): Promise<void> {
    const existing = await this.userRepository.findAll();
    if (existing.length > 0) {
      this.logger.log('Users already exist. Skipping default admin creation.');
      return;
    }

    const adminLogin = this.configService.get<string>(
      'DEFAULT_ADMIN_LOGIN',
      'admin',
    );
    const adminPassword = this.configService.get<string>(
      'DEFAULT_ADMIN_PASSWORD',
      'admin123',
    );
    const adminFirstName = this.configService.get<string>(
      'DEFAULT_ADMIN_FIRSTNAME',
      'System',
    );
    const adminLastName = this.configService.get<string>(
      'DEFAULT_ADMIN_LASTNAME',
      'Administrator',
    );

    const passwordHash = await this.passwordHasher.hash(adminPassword);

    const adminId = SEED_USER_IDS.ADMIN;
    const admin = User.createAdmin(
      {
        login: LoginValue.create(adminLogin),
        password: PasswordValue.create(passwordHash),
        firstName: adminFirstName,
        lastName: adminLastName,
      },
      adminId,
    );

    const aggregate = UserAggregate.create(admin);
    await this.userRepository.save(aggregate);

    this.logger.log(
      `Default administrator created. Login: ${adminLogin} Password: ${adminPassword}`,
    );
  }

  private async seedTestUsers(count: number): Promise<void> {
    const existingUsers = await this.userRepository.findAll();
    if (existingUsers.length > 1) {
      this.logger.log('Test users already seeded. Skipping.');
      return;
    }

    this.logger.log(`Seeding ${count} test users...`);

    const userIds = [
      SEED_USER_IDS.USER_1, SEED_USER_IDS.USER_2, SEED_USER_IDS.USER_3,
      SEED_USER_IDS.USER_4, SEED_USER_IDS.USER_5,
    ];

    for (let i = 1; i <= count; i++) {
      const login = `user${i}`;
      const passwordPlain = `password${i}`;

      const passwordHash = await this.passwordHasher.hash(passwordPlain);

      const user = User.create(
        {
          login: LoginValue.create(login),
          password: PasswordValue.create(passwordHash),
          firstName: `User${i}`,
          lastName: `Tester${i}`,
        },
        userIds[i - 1] ?? uuidv4(),
      );

      const agg = UserAggregate.create(user);
      await this.userRepository.save(agg);

      this.logger.log(`✔ Created test user: ${login} / ${passwordPlain}`);
    }
  }

  private async seedDriverLicensesForSomeUsers(): Promise<void> {
    const users = await this.userRepository.findAll();
    const regularUsers = users
      .filter((u) => u.getUser().getRole() !== 'Admin')
      .slice(0, 3);

    if (regularUsers.length === 0) {
      this.logger.log('No regular users found for driver licenses seeding.');
      return;
    }

    this.logger.log('Seeding driver licenses for first 3 users...');

    const birthDates = [
      new Date(1990, 4, 15),
      new Date(1993, 8, 22),
      new Date(1988, 1, 7),
    ];

    const issuedBys = [
      'МРЭО ГИБДД №1 г. Москва',
      'МРЭО ГИБДД №3 г. Санкт-Петербург',
      'МРЭО ГИБДД №2 г. Казань',
    ];

    for (let i = 0; i < regularUsers.length; i++) {
      const aggregate = regularUsers[i];
      if (aggregate.getDriverLicense()) {
        this.logger.log(
          `User ${aggregate.getUser().getLogin().getValue()} already has a driver license. Skipping.`,
        );
        continue;
      }

      const user = aggregate.getUser();
      const licenseId = uuidv4();
      const issueDate = new Date(2018 + i, 2 + i, 10 + i);
      const expiryDate = new Date(issueDate);
      expiryDate.setFullYear(expiryDate.getFullYear() + 10);

      const driverLicense = DriverLicense.create(
        {
          userId: user.getId(),
          firstName: user.getFirstName(),
          lastName: user.getLastName() || 'Тестов',
          middleName: user.getMiddleName(),
          birthDate: birthDates[i],
          birthPlace: ['Москва', 'Санкт-Петербург', 'Казань'][i],
          issueDate,
          expiryDate,
          issuedBy: issuedBys[i],
          licenseNumber: DriverLicenseNumberValue.create(
            `77 ${String(10 + i * 7).padStart(2, '0')} ${String(100000 + i * 12345).slice(0, 6)}`,
          ),
        },
        licenseId,
      );

      aggregate.addDriverLicense(driverLicense);
      await this.userRepository.save(aggregate);

      this.logger.log(
        `✔ Added driver license to user ${user.getLogin().getValue()}`,
      );
    }
  }
}
