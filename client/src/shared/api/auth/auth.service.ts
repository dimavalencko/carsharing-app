import { defaultHttpClient } from '@/app/axios/defaultHttpClient';
import type { AuthUser, LoginDto, RegisterDto } from '@/shared/types';

export const authService = {
  async register(dto: RegisterDto): Promise<AuthUser> {
    const { data } = await defaultHttpClient.post<AuthUser>('/identity/auth/register', dto);
    return data;
  },

  async login(dto: LoginDto): Promise<AuthUser> {
    const { data } = await defaultHttpClient.post<AuthUser>('/identity/auth/login', dto);
    return data;
  },

  async logout(): Promise<void> {
    await defaultHttpClient.post('/identity/auth/logout');
  },

  async refresh(): Promise<void> {
    await defaultHttpClient.post('/identity/auth/refresh');
  },
};
