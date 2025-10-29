import { Repository } from 'typeorm';
import { IDriverLicenseRepository } from '@/domain/interfaces/repositories';
import { DriverLicense } from '@/domain/entities/driver-license.entity';
import { DriverLicenseEntity } from '../entities/driver-license.entity';
import { DriverLicenseMapper } from '../mappers/driver-license.mapper';

export class DriverLicenseRepository implements IDriverLicenseRepository {
  constructor(private readonly ormRepo: Repository<DriverLicenseEntity>) {}

  async findById(id: string): Promise<DriverLicense | null> {
    const entity = await this.ormRepo.findOne({ where: { id } });
    return entity ? DriverLicenseMapper.toDomain(entity) : null;
  }

  async findByUserId(userId: string): Promise<DriverLicense | null> {
    const entity = await this.ormRepo.findOne({ where: { userId } });
    return entity ? DriverLicenseMapper.toDomain(entity) : null;
  }

  async findByLicenseNumber(
    licenseNumber: string,
  ): Promise<DriverLicense | null> {
    const entity = await this.ormRepo.findOne({ where: { licenseNumber } });
    return entity ? DriverLicenseMapper.toDomain(entity) : null;
  }

  async save(driverLicense: DriverLicense): Promise<void> {
    const entity = DriverLicenseMapper.toPersistence(driverLicense);
    await this.ormRepo.save(entity);
  }

  async delete(id: string): Promise<void> {
    await this.ormRepo.delete({ id });
  }
}
