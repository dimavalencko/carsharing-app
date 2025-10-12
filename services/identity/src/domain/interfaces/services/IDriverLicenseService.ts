import { CreateDriverLicenseDto, UpdateDriverLicenseDto, DriverLicenseResponseDto } from '@carsharing/common';

export interface IDriverLicenseService {
  createDriverLicense(userId: string, dto: CreateDriverLicenseDto): Promise<DriverLicenseResponseDto>;
  getDriverLicense(userId: string): Promise<DriverLicenseResponseDto | null>;
  updateDriverLicense(userId: string, dto: UpdateDriverLicenseDto): Promise<DriverLicenseResponseDto>;
  deleteDriverLicense(userId: string): Promise<void>;
  
  canUserRentCar(userId: string): Promise<boolean>;
  hasValidDriverLicense(userId: string): Promise<boolean>;
  getDriverLicenseStatus(userId: string): Promise<{ hasLicense: boolean; isValid: boolean }>;
}