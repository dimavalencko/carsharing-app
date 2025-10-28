import { DriverLicense } from "../entities";
import { IDriverLicenseRepository } from "../interfaces/repositories";
import { DriverLicenseNumberValue } from "../value-objects";

export class DriverLicenseService {
  constructor(
    private driverLicenseRepository: IDriverLicenseRepository
  ) {}

  async createDriverLicense(command: {
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
  }): Promise<DriverLicense> {
    // Валидация уникальности номера прав
    const existingLicense = await this.driverLicenseRepository.findByLicenseNumber(command.licenseNumber);
    if (existingLicense) {
      throw new Error('Driver license with this number already exists');
    }

    const driverLicense = DriverLicense.create({
      userId: command.userId,
      firstName: command.firstName,
      lastName: command.lastName,
      middleName: command.middleName,
      birthDate: command.birthDate,
      birthPlace: command.birthPlace,
      issueDate: command.issueDate,
      expiryDate: command.expiryDate,
      issuedBy: command.issuedBy,
      licenseNumber: DriverLicenseNumberValue.create(command.licenseNumber)
    });

    await this.driverLicenseRepository.save(driverLicense);
    return driverLicense;
  }

  async updateDriverLicense(licenseId: string, updateData: {
    firstName?: string;
    lastName?: string;
    middleName?: string;
    birthPlace?: string;
    issuedBy?: string;
  }): Promise<DriverLicense> {
    const driverLicense = await this.driverLicenseRepository.findById(licenseId);
    
    if (!driverLicense) {
      throw new Error('Driver license not found');
    }

    driverLicense.updateInfo(updateData);
    await this.driverLicenseRepository.save(driverLicense);

    return driverLicense;
  }
}