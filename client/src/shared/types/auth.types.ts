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

export interface UserProfile {
  id: string;
  username: string;
  firstName: string;
  lastName?: string;
  middleName?: string;
  email?: string;
  phoneNumber?: string;
  birthDate?: string;
  city?: string;
  avatarUrl?: string;
  role: UserRole;
  hasDriverLicense: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileDto {
  lastName?: string;
  middleName?: string;
  email?: string;
  phoneNumber?: string;
  birthDate?: string;
  city?: string;
  avatarUrl?: string;
}

export interface ChangePasswordDto {
  oldPassword: string;
  newPassword: string;
}

export interface DriverLicense {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  birthDate: string;
  birthPlace: string;
  issueDate: string;
  expiryDate: string;
  issuedBy: string;
  licenseNumber: string;
  isExpired: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AddDriverLicenseDto {
  firstName: string;
  lastName: string;
  middleName?: string;
  birthDate: string;
  birthPlace: string;
  issueDate: string;
  expiryDate: string;
  issuedBy: string;
  licenseNumber: string;
}

export interface UpdateDriverLicenseDto {
  firstName?: string;
  lastName?: string;
  middleName?: string;
  birthPlace?: string;
  issuedBy?: string;
}
