import { UserAggregate } from '@/domain/aggregates/user';
import { DriverLicense } from '@/domain/entities/driver-license.entity';
import { TransactionManager } from '@/infrastructure/persistence/typeorm/transaction/transaction-manager';
import { UnitOfWork } from '@/infrastructure/persistence/typeorm/transaction/unit-of-work';

export class UserCreationService {
  constructor(private readonly txManager: TransactionManager) {}

  async createUserWithOptionalDriverLicense(
    userAggregate: UserAggregate,
    driverLicense?: DriverLicense,
  ): Promise<void> {
    await this.txManager.execute(async ({ manager }) => {
      const uow = new UnitOfWork(manager);

      // Сохраняем пользователя
      await uow.users.save(userAggregate);

      // Если присутствует водительское удостоверение — сохраняем
      if (driverLicense) {
        await uow.driverLicenses.save(driverLicense);
      }
    });
  }
}
