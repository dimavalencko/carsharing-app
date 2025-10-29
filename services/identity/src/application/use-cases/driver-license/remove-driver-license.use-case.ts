import { IDriverLicenseRepository, IUserRepository } from "@/domain/interfaces/repositories";

export class RemoveDriverLicenseUseCase {
  constructor(
    private userRepository: IUserRepository,
    private driverLicenseRepository: IDriverLicenseRepository
  ) {}

  async execute(userId: string): Promise<void> {
    const userAggregate = await this.userRepository.findById(userId);
    
    if (!userAggregate) {
      throw new Error('User not found');
    }

    const driverLicense = userAggregate.getDriverLicense();
    if (!driverLicense) {
      throw new Error('User does not have driver license');
    }

    userAggregate.removeDriverLicense();
    await this.driverLicenseRepository.delete(driverLicense.getId());
    await this.userRepository.save(userAggregate);
  }
}
