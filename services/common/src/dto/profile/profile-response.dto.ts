import { UserResponseDto } from "../user";

export class UserProfileResponseDto {
  user: UserResponseDto;
  profile: {
    profilePicture?: string;
    city?: string;
  };
  driverLicense?: {
    licenseNumber: string;
    issueDate: Date;
    expirationDate: Date;
  };
}