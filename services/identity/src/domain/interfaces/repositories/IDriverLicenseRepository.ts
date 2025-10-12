import { DriverLicense } from "@/domain/entities";

export interface IDriverLicenseRepository {
  findByUserId(userId: string): Promise<DriverLicense | null>;
  save(license: DriverLicense): Promise<DriverLicense>;
  delete(userId: string): Promise<void>;
}