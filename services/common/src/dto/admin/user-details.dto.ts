import { DriverLicenseResponseDto } from "../driver-license";
import { UserResponseDto } from "../user";

export class UserDetailsDto {
  user: UserResponseDto;
  profile: {
    profilePicture?: string;
    city?: string;
  };
  driverLicense?: DriverLicenseResponseDto;
  canRentCar: boolean;
}