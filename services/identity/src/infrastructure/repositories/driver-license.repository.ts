import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IDriverLicenseRepository } from '@domain/interfaces/repositories';
import { DriverLicense } from '@domain/entities';
import { DriverLicenseEntity } from '../persistence/typeorm/entities';
import { DriverLicenseMapper } from '../persistence/typeorm/mappers';

@Injectable()
export class DriverLicenseRepository implements IDriverLicenseRepository {
  constructor(
    @InjectRepository(DriverLicenseEntity)
    private readonly repository: Repository<DriverLicenseEntity>,
  ) {}

  async findByUserId(userId: string): Promise<DriverLicense | null> {
    const entity = await this.repository.findOne({ where: { userId } });
    return entity ? DriverLicenseMapper.toDomain(entity) : null;
  }

  async save(license: DriverLicense): Promise<DriverLicense> {
    const entity = DriverLicenseMapper.toPersistence(license);
    const savedEntity = await this.repository.save(entity);
    return DriverLicenseMapper.toDomain(savedEntity);
  }

  async delete(userId: string): Promise<void> {
    await this.repository.delete({ userId });
  }

  async existsForUser(userId: string): Promise<boolean> {
    const count = await this.repository.count({
      where: { userId }
    });
    return count > 0;
  }
}