import { Injectable, Inject, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';

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

//SeederService — отвечает за первоначальное наполнение БД базовыми данными
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

  // Создаёт администратора по умолчанию, если система пуста
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

    const adminId = uuidv4();
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

  // Создаёт N тестовых пользователей, если их ещё нет
  private async seedTestUsers(count: number): Promise<void> {
    const existingUsers = await this.userRepository.findAll();
    // Если уже больше 1 (админ), то пропускаем создание тестовых
    if (existingUsers.length > 1) {
      this.logger.log('Test users already seeded. Skipping.');
      return;
    }

    this.logger.log(`Seeding ${count} test users...`);

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
        uuidv4(),
      );

      const agg = UserAggregate.create(user);
      await this.userRepository.save(agg);

      this.logger.log(`✔ Created test user: ${login} / ${passwordPlain}`);
    }
  }

  // Выдаём водительские права части пользователей
  private async seedDriverLicensesForSomeUsers(): Promise<void> {
    const users = await this.userRepository.findAll();
    // Пропускаем админа (он первый)
    const regularUsers = users.slice(1);

    if (regularUsers.length === 0) {
      this.logger.log('No regular users found for driver licenses seeding.');
      return;
    }

    this.logger.log('Seeding driver licenses for some users...');

    for (let i = 0; i < regularUsers.length; i++) {
      if (i % 2 === 0) {
        // каждому второму
        const aggregate = regularUsers[i];
        if (aggregate.getDriverLicense()) {
          continue;
        }

        const user = aggregate.getUser();
        const licenseId = uuidv4();

        const driverLicense = DriverLicense.create(
          {
            userId: user.getId(),
            firstName: user.getFirstName(),
            lastName: user.getLastName() || 'Unknown',
            middleName: user.getMiddleName(),
            birthDate: new Date(1995, 0, 1),
            birthPlace: 'Unknown City',
            issueDate: new Date(),
            expiryDate: new Date(
              new Date().setFullYear(new Date().getFullYear() + 10),
            ),
            issuedBy: 'GIBDD Test',
            licenseNumber: DriverLicenseNumberValue.create(
              `DL-${Math.floor(Math.random() * 100000)}`,
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
}
