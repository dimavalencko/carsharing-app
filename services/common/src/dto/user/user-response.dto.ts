export class UserResponseDto {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  patronymic?: string;
  dateOfBirth: Date;
  phone?: string;
  role: string;
  createdAt: Date;
  lastLoginAt?: Date;
}