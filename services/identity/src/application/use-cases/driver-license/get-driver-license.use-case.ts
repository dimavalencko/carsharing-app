import { DriverLicense } from "@/domain/entities";
import { IDriverLicenseRepository } from "@/domain/interfaces/repositories";

export class GetDriverLicenseByUserIdUseCase {
  constructor(private driverLicenseRepository: IDriverLicenseRepository) {}

  async execute(userId: string): Promise<DriverLicense | null> {
    return await this.driverLicenseRepository.findByUserId(userId);
  }
}
