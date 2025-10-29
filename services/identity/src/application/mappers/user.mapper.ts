import { UserAggregate } from "@/domain/aggregates/user";

export interface UserResponseDto {
  id: string;
  username: string;
  firstName: string;
  lastName?: string;
  middleName?: string;
  email?: string;
  phoneNumber?: string;
  birthDate?: Date;
  city?: string;
  avatarUrl?: string;
  role: string;
  hasDriverLicense: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class UserMapper {
  static toResponseDto(userAggregate: UserAggregate): UserResponseDto {
    const user = userAggregate.getUser();
    
    return {
      id: user.getId(),
      username: user.getLogin().getValue(),
      firstName: user.getFirstName(),
      lastName: user.getLastName(),
      middleName: user.getMiddleName(),
      email: user.getEmail()?.getValue(),
      phoneNumber: user.getPhoneNumber()?.getValue(),
      birthDate: user.getBirthDate(),
      city: user.getCity(),
      avatarUrl: user.getAvatarUrl(),
      role: user.getRole(),
      hasDriverLicense: userAggregate.hasDriverLicense(),
      createdAt: user.getCreatedAt(),
      updatedAt: user.getUpdatedAt()
    };
  }
}
