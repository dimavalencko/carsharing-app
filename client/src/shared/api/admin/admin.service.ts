import { defaultHttpClient } from '@/app/axios/defaultHttpClient';
import type { AdminUserDto, CreateAdminUserDto } from '@/shared/types';

export const adminService = {
  async getUsers(): Promise<AdminUserDto[]> {
    const { data } = await defaultHttpClient.get<AdminUserDto[]>('/identity/admin/users');
    return data;
  },

  async createUser(dto: CreateAdminUserDto): Promise<AdminUserDto> {
    const { data } = await defaultHttpClient.post<AdminUserDto>('/identity/admin/users', dto);
    return data;
  },

  async createAdminUser(dto: CreateAdminUserDto): Promise<AdminUserDto> {
    const { data } = await defaultHttpClient.post<AdminUserDto>('/identity/admin/admins', dto);
    return data;
  },

  async deleteUser(id: string): Promise<void> {
    await defaultHttpClient.delete(`/identity/admin/users/${id}`);
  },
};
