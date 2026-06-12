import { defaultHttpClient } from '@/app/axios/defaultHttpClient';
import type {
  UserProfile,
  UpdateProfileDto,
  ChangePasswordDto,
  DriverLicense,
  AddDriverLicenseDto,
  UpdateDriverLicenseDto,
} from '@/shared/types';

export const profileService = {
  async getProfile(): Promise<UserProfile> {
    const { data } = await defaultHttpClient.get<UserProfile>('/identity/users/profile');
    return data;
  },

  async updateProfile(dto: UpdateProfileDto): Promise<UserProfile> {
    const { data } = await defaultHttpClient.put<UserProfile>('/identity/users/profile', dto);
    return data;
  },

  async changePassword(dto: ChangePasswordDto): Promise<void> {
    await defaultHttpClient.post('/identity/auth/change-password', dto);
  },

  async getDriverLicense(): Promise<DriverLicense | null> {
    try {
      const { data } = await defaultHttpClient.get<DriverLicense>('/identity/driver-license');
      if ((data as any).error) return null;
      return data;
    } catch {
      return null;
    }
  },

  async addDriverLicense(dto: AddDriverLicenseDto): Promise<DriverLicense> {
    const { data } = await defaultHttpClient.post<DriverLicense>('/identity/driver-license', dto);
    return data;
  },

  async updateDriverLicense(dto: UpdateDriverLicenseDto): Promise<DriverLicense> {
    const { data } = await defaultHttpClient.put<DriverLicense>('/identity/driver-license', dto);
    return data;
  },

  async deleteDriverLicense(): Promise<void> {
    await defaultHttpClient.delete('/identity/driver-license');
  },
};
