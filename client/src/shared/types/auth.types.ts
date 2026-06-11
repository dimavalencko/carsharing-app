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
