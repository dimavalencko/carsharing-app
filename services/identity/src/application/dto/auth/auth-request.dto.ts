export class RegisterUserDto {
  username: string;
  password: string;
  firstName: string;
  lastName?: string;
  middleName?: string;
}

export class LoginUserDto {
  username: string;
  password: string;
}

export class ChangePasswordDto {
  oldPassword: string;
  newPassword: string;
}

export class RefreshTokenDto {
  refreshToken: string;
}
