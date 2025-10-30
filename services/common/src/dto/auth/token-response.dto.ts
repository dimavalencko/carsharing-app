import { UserRoles } from "../../enums";

export class TokenResponseDto {
  constructor(
    public readonly accessToken: string,
    public readonly refreshToken: string,
    public readonly user: {
      id: string;
      email: string;
      role: UserRoles;
      hasDriverLicense: boolean;
      isDriverLicenseValid: boolean;
    },
  ) {}
}