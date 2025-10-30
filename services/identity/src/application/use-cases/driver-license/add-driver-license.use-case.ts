import { v4 as uuidv4 } from 'uuid';
import { UserAggregate } from '@/domain/aggregates/user';
import { DriverLicense } from '@/domain/entities';
import {
  IDriverLicenseRepository,
  IUserRepository,
} from '@/domain/interfaces/repositories';
import { DriverLicenseNumberValue } from '@/domain/value-objects';

export interface AddDriverLicenseDto {
  firstName: string;
  lastName: string;
  middleName?: string;
  birthDate: Date;
  birthPlace: string;
  issueDate: Date;
  expiryDate: Date;
  issuedBy: string;
  licenseNumber: string;
}

export class AddDriverLicenseUseCase {
  constructor(
    private userRepository: IUserRepository,
    private driverLicenseRepository: IDriverLicenseRepository,
  ) {}

  async execute(
    userId: string,
    dto: AddDriverLicenseDto,
  ): Promise<UserAggregate> {
    const userAggregate = await this.userRepository.findById(userId);

    if (!userAggregate) {
      throw new Error('User not found');
    }

    if (userAggregate.hasDriverLicense()) {
      throw new Error('User already has driver license');
    }

    // Проверяем уникальность номера ВУ
    const existingLicense =
      await this.driverLicenseRepository.findByLicenseNumber(dto.licenseNumber);
    if (existingLicense) {
      throw new Error('Driver license with this number already exists');
    }

    const licenseId = uuidv4();
    const driverLicense = DriverLicense.create(
      {
        userId,
        firstName: dto.firstName,
        lastName: dto.lastName,
        middleName: dto.middleName,
        birthDate: dto.birthDate,
        birthPlace: dto.birthPlace,
        issueDate: dto.issueDate,
        expiryDate: dto.expiryDate,
        issuedBy: dto.issuedBy,
        licenseNumber: DriverLicenseNumberValue.create(dto.licenseNumber),
      },
      licenseId,
    );

    userAggregate.addDriverLicense(driverLicense);

    await this.driverLicenseRepository.save(driverLicense);
    await this.userRepository.save(userAggregate);

    return userAggregate;
  }
}
