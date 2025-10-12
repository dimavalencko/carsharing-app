import { DriverLicense } from '@domain/entities';
import { DriverLicenseEntity } from '../entities/driver-license.entity';

export class DriverLicenseMapper {
  static toDomain(entity: DriverLicenseEntity): DriverLicense {
    return new DriverLicense(
      entity.id,
      entity.userId,
      entity.licenseNumber,
      entity.issueDate,
      entity.expirationDate,
      entity.createdAt,
      entity.updatedAt,
    );
  }

  static toPersistence(license: DriverLicense): DriverLicenseEntity {
    const entity = new DriverLicenseEntity();
    entity.id = license.id;
    entity.userId = license.userId;
    entity.licenseNumber = license.licenseNumber;
    entity.issueDate = license.issueDate;
    entity.expirationDate = license.expirationDate;
    entity.createdAt = license.createdAt;
    entity.updatedAt = license.updatedAt;
    return entity;
  }
}