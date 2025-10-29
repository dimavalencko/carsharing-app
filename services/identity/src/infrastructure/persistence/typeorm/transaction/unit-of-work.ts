import { EntityManager } from 'typeorm';
import { UserRepository } from '../repositories/user.repository';
import { DriverLicenseRepository } from '../repositories/driver-license.repository';
import { RefreshTokenRepository } from '../repositories/refresh-token.repository';
import { UserEntity } from '../entities/user.entity';
import { DriverLicenseEntity } from '../entities/driver-license.entity';
import { RefreshTokenEntity } from '../entities/refresh-token.entity';

// UnitOfWork предоставляет доступ к репозиториям,привязанным к одному EntityManager внутри транзакции.
export class UnitOfWork {
  public readonly users: UserRepository;
  public readonly driverLicenses: DriverLicenseRepository;
  public readonly refreshTokens: RefreshTokenRepository;

  constructor(private readonly manager: EntityManager) {
    this.users = new UserRepository(this.manager.getRepository(UserEntity));
    this.driverLicenses = new DriverLicenseRepository(this.manager.getRepository(DriverLicenseEntity));
    this.refreshTokens = new RefreshTokenRepository(this.manager.getRepository(RefreshTokenEntity));
  }
}