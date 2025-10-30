export interface CreateUserDto {
  username: string;
  password: string;
  firstName: string;
  lastName?: string;
  middleName?: string;
  email?: string;
  phoneNumber?: string;
  birthDate?: Date;
  city?: string;
  avatarUrl?: string;
  role: string;
}
