import { IDriverLicenseRepository } from '@/domain/interfaces/repositories';
import { DriverLicense } from '@/domain/entities';

export interface UpdateDriverLicenseDto {
  firstName?: string;
  lastName?: string;
  middleName?: string;
  birthPlace?: string;
  issuedBy?: string;
}

export class UpdateDriverLicenseUseCase {
  constructor(private driverLicenseRepository: IDriverLicenseRepository) {}

  async execute(userId: string, dto: UpdateDriverLicenseDto): Promise<DriverLicense> {
    const license = await this.driverLicenseRepository.findByUserId(userId);
    if (!license) {
      throw new Error('Driver license not found');
    }
    license.updateInfo(dto);
    await this.driverLicenseRepository.save(license);
    return license;
  }
}
