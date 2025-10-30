import { IDriverLicenseRepository } from '@/domain/interfaces/repositories';

export class DeleteDriverLicenseUseCase {
  constructor(private driverLicenseRepository: IDriverLicenseRepository) {}

  async execute(userId: string): Promise<void> {
    const license = await this.driverLicenseRepository.findByUserId(userId);
    if (!license) {
      throw new Error('Driver license not found');
    }
    await this.driverLicenseRepository.delete(license.getId());
  }
}
