import { UserAggregate } from "@/domain/aggregates/user";
import { IUserRepository } from "@/domain/interfaces/repositories";
import { EmailValue, PhoneNumberValue } from "@/domain/value-objects";

export interface UpdateUserProfileDto {
  lastName?: string;
  middleName?: string;
  email?: string;
  phoneNumber?: string;
  birthDate?: Date;
  city?: string;
  avatarUrl?: string;
}

type UserUpdateData = {
  lastName?: string;
  middleName?: string;
  email?: EmailValue;
  phoneNumber?: PhoneNumberValue;
  birthDate?: Date;
  city?: string;
  avatarUrl?: string;
};

export class UpdateUserProfileUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(userId: string, dto: UpdateUserProfileDto): Promise<UserAggregate> {
    const userAggregate = await this.userRepository.findById(userId);
    
    if (!userAggregate) {
      throw new Error('User not found');
    }

    const user = userAggregate.getUser();

    const updateData: UserUpdateData = {
      lastName: dto.lastName,
      middleName: dto.middleName,
      birthDate: dto.birthDate,
      city: dto.city,
      avatarUrl: dto.avatarUrl
    };

    if (dto.email) {
      updateData.email = EmailValue.create(dto.email);
    }

    if (dto.phoneNumber) {
      updateData.phoneNumber = PhoneNumberValue.create(dto.phoneNumber);
    }

    user.updateProfile(updateData);
    await this.userRepository.save(userAggregate);

    return userAggregate;
  }
}
