import { Injectable, Inject } from '@nestjs/common';
import { AddDriverLicenseUseCase, GetDriverLicenseByUserIdUseCase, UpdateDriverLicenseUseCase, DeleteDriverLicenseUseCase, AddDriverLicenseDto, UpdateDriverLicenseDto } from '../use-cases/driver-license';
import type { IDriverLicenseRepository, IUserRepository } from '@/domain/interfaces/repositories';
import { DriverLicenseMapper, DriverLicenseResponseDto } from '../mappers';

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

  async create(userId: string, dto: AddDriverLicenseDto): Promise<DriverLicenseResponseDto> {
    const aggregate = await this.addDriverLicenseUseCase.execute(userId, dto);
    const license = aggregate.getDriverLicense();
    if (!license) throw new Error('Failed to create driver license');
    return DriverLicenseMapper.toResponseDto(license);
  }

  async getByUserId(userId: string): Promise<DriverLicenseResponseDto | null> {
    const license = await this.getDriverLicenseByUserIdUseCase.execute(userId);
    if (!license) return null;
    return DriverLicenseMapper.toResponseDto(license);
  }

  async update(userId: string, dto: UpdateDriverLicenseDto): Promise<DriverLicenseResponseDto> {
    const license = await this.updateDriverLicenseUseCase.execute(userId, dto);
    return DriverLicenseMapper.toResponseDto(license);
  }

  async delete(userId: string) {
    return this.deleteDriverLicenseUseCase.execute(userId);
  }
}
