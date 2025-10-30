import { Injectable, Inject } from '@nestjs/common';
import { AddDriverLicenseUseCase, GetDriverLicenseByUserIdUseCase, UpdateDriverLicenseUseCase, DeleteDriverLicenseUseCase, AddDriverLicenseDto, UpdateDriverLicenseDto } from '../use-cases/driver-license';
import type { IDriverLicenseRepository, IUserRepository } from '@/domain/interfaces/repositories';

@Injectable()
export class DriverLicenseService {
  private addDriverLicenseUseCase: AddDriverLicenseUseCase;
  private getDriverLicenseByUserIdUseCase: GetDriverLicenseByUserIdUseCase;
  private updateDriverLicenseUseCase: UpdateDriverLicenseUseCase;
  private deleteDriverLicenseUseCase: DeleteDriverLicenseUseCase;

  constructor(
    @Inject('IDriverLicenseRepository') private driverLicenseRepository: IDriverLicenseRepository,
    @Inject('IUserRepository') private userRepository: IUserRepository,
  ) {
    this.addDriverLicenseUseCase = new AddDriverLicenseUseCase(this.userRepository, this.driverLicenseRepository);
    this.getDriverLicenseByUserIdUseCase = new GetDriverLicenseByUserIdUseCase(this.driverLicenseRepository);
    this.updateDriverLicenseUseCase = new UpdateDriverLicenseUseCase(this.driverLicenseRepository);
    this.deleteDriverLicenseUseCase = new DeleteDriverLicenseUseCase(this.driverLicenseRepository);
  }

  async create(userId: string, dto: AddDriverLicenseDto) {
    const aggregate = await this.addDriverLicenseUseCase.execute(userId, dto);
    return aggregate.getDriverLicense();
  }

  async getByUserId(userId: string) {
    return this.getDriverLicenseByUserIdUseCase.execute(userId);
  }

  async update(userId: string, dto: UpdateDriverLicenseDto) {
    return this.updateDriverLicenseUseCase.execute(userId, dto);
  }

  async delete(userId: string) {
    return this.deleteDriverLicenseUseCase.execute(userId);
  }
}
