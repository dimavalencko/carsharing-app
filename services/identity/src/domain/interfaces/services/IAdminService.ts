import { UserDetailsDto, SystemStatsDto, UserResponseDto, DriverLicenseResponseDto } from '@carsharing/common';

export interface IAdminService {
  getAllUsers(): Promise<UserResponseDto[]>;
  getUserDetails(userId: string): Promise<UserDetailsDto>;
  getUserDriverLicense(userId: string): Promise<DriverLicenseResponseDto | null>;
  
  getSystemStats(): Promise<SystemStatsDto>;
  getActiveSessionsCount(): Promise<number>;
  
  forceLogoutUser(userId: string): Promise<void>;
  getUserLoginHistory(userId: string): Promise<any[]>;
}