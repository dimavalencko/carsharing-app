import { UserResponseDto, UpdateUserDto, UserProfileResponseDto, UpdateProfileDto } from '@carsharing/common';

export interface IUsersService {
  getUserById(id: string): Promise<UserResponseDto>;
  getUserByEmail(email: string): Promise<UserResponseDto | null>;
  updateUser(userId: string, dto: UpdateUserDto): Promise<UserResponseDto>;
  deleteUser(userId: string): Promise<void>;
  
  getUserProfile(userId: string): Promise<UserProfileResponseDto>;
  updateUserProfile(userId: string, dto: UpdateProfileDto): Promise<UserProfileResponseDto>;
}