export class CreateUserRequestDto {
  login: string;
  password: string;
  firstName: string;
  lastName?: string;
  middleName?: string;
  email?: string;
  phoneNumber?: string;
  birthDate?: string;
  city?: string;
  avatarUrl?: string;
}