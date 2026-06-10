export type UserRole = 'User' | 'Admin';

export interface AuthUser {
  userId: string;
  username: string;
  role: UserRole;
}

export interface RegisterDto {
  username: string;
  password: string;
  firstName: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
}

export interface LoginDto {
  username: string;
  password: string;
}
