import { DriverLicense } from "@/domain/entities";

export interface IDriverLicenseRepository {
  findById(id: string): Promise<DriverLicense | null>;
  findByUserId(userId: string): Promise<DriverLicense | null>;
  findByLicenseNumber(licenseNumber: string): Promise<DriverLicense | null>;
  save(driverLicense: DriverLicense): Promise<void>;
  delete(id: string): Promise<void>;
}