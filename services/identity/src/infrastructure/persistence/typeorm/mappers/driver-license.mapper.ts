import { DriverLicense } from '@/domain/entities';
import { DriverLicenseEntity } from '../entities';
import { DriverLicenseNumberValue } from '@/domain/value-objects';

export class DriverLicenseMapper {
  /**
   * Преобразование Domain DriverLicense -> TypeORM Entity
   */
  static toPersistence(license: DriverLicense): DriverLicenseEntity {
    const entity = new DriverLicenseEntity();
    entity.id = license.getId();
    entity.userId = license.getUserId();
    entity.firstName = license.getFirstName();
    entity.lastName = license.getLastName();
    entity.middleName = license.getMiddleName();
    entity.birthDate = license.getBirthDate();
    entity.birthPlace = license.getBirthPlace();
    entity.licenseNumber = license.getLicenseNumber().getValue();
    entity.issueDate = license.getIssueDate();
    entity.expiryDate = license.getExpiryDate();
    entity.issuedBy = license.getIssuedBy();
    entity.createdAt = license.getCreatedAt();
    entity.updatedAt = license.getUpdatedAt();
    return entity;
  }

  /**
   * Преобразование TypeORM DriverLicenseEntity -> Domain
   */
  static toDomain(entity: DriverLicenseEntity): DriverLicense {
    return DriverLicense.reconstitute(entity.id, {
      userId: entity.userId,
      firstName: entity.firstName,
      lastName: entity.lastName,
      middleName: entity.middleName,
      birthDate: entity.birthDate,
      birthPlace: entity.birthPlace,
      licenseNumber: DriverLicenseNumberValue.create(entity.licenseNumber),
      issueDate: entity.issueDate,
      expiryDate: entity.expiryDate,
      issuedBy: entity.issuedBy,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }
}
