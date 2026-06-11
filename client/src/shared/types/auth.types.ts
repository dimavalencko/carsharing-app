export type UserRole = 'User' | 'Admin';

export interface AuthUser {
  userId: string;
  username: string;
  role: UserRole;
}

export interface RegisterDto {
  login: string;
  password: string;
  firstName: string;
  lastName?: string;
}

export interface LoginDto {
  username: string;
  password: string;
}

export interface AdminUserDto {
  id: string;
  login: string;
  firstName: string;
  lastName?: string;
  middleName?: string;
  email?: string;
  phoneNumber?: string;
  city?: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAdminUserDto {
  login: string;
  password: string;
  firstName: string;
  lastName?: string;
  role?: UserRole;
}
