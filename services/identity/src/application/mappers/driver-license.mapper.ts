import { DriverLicense } from "@/domain/entities";

export interface DriverLicenseResponseDto {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  birthDate: Date;
  birthPlace: string;
  issueDate: Date;
  expiryDate: Date;
  issuedBy: string;
  licenseNumber: string;
  isExpired: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class DriverLicenseMapper {
  static toResponseDto(driverLicense: DriverLicense): DriverLicenseResponseDto {
    return {
      id: driverLicense.getId(),
      userId: driverLicense.getUserId(),
      firstName: driverLicense.getFirstName(),
      lastName: driverLicense.getLastName(),
      middleName: driverLicense.getMiddleName(),
      birthDate: driverLicense.getBirthDate(),
      birthPlace: driverLicense.getBirthPlace(),
      issueDate: driverLicense.getIssueDate(),
      expiryDate: driverLicense.getExpiryDate(),
      issuedBy: driverLicense.getIssuedBy(),
      licenseNumber: driverLicense.getLicenseNumber().getValue(),
      isExpired: driverLicense.isExpired(),
      createdAt: driverLicense.getCreatedAt(),
      updatedAt: driverLicense.getUpdatedAt()
    };
  }
}
