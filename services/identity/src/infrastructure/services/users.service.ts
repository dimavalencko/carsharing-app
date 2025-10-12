import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { IRoleService, IUserService } from '@domain/interfaces/services';
import type { IUserRepository, IDriverLicenseRepository, IUserProfileRepository } from '@domain/interfaces/repositories';
import { Email } from 'src/domain/value-objects/email.vo';
import { randomUUID } from 'crypto';
import { UpdateProfileDto, UpdateUserDto, UserProfileResponseDto, UserResponseDto } from '@carsharing/common';
import { UserProfile } from '@/domain/entities';


@Injectable()
export class UserService implements IUserService {
  constructor(
    @Inject('IUserRepository') private readonly userRepository: IUserRepository,
    @Inject('IUserProfileRepository') private readonly userProfileRepository: IUserProfileRepository,
    @Inject('IRoleService') private readonly roleService: IRoleService,
    @Inject('IDriverLicenseRepository') private readonly driverLicenseRepository: IDriverLicenseRepository,
  ) {}

  async getUserById(id: string): Promise<UserResponseDto> {
    const user = await this.userRepository.getById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const role = await this.roleService.getUserRole(user.id);
    return this.mapUserToResponseDto(user, role.name);
  }

  async getUserByEmail(email: string): Promise<UserResponseDto | null> {
    const user = await this.userRepository.findByEmail(new Email(email));
    if (!user) {
      return null;
    }

    const role = await this.roleService.getUserRole(user.id);
    return this.mapUserToResponseDto(user, role.name);
  }

  async updateUser(userId: string, dto: UpdateUserDto): Promise<UserResponseDto> {
    const user = await this.userRepository.getById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Обновляем основные данные
    if (dto.firstName || dto.lastName || dto.dateOfBirth) {
      user.updatePersonalInfo(
        dto.firstName || user.firstName,
        dto.lastName || user.lastName,
        dto.dateOfBirth || user.dateOfBirth,
      );
    }

    // Теперь можем устанавливать phone и patronymic через сеттеры
    if (dto.phone !== undefined) {
      user.phone = dto.phone;
    }
    if (dto.patronymic !== undefined) {
      user.patronymic = dto.patronymic;
    }

    const updatedUser = await this.userRepository.save(user);
    const role = await this.roleService.getUserRole(updatedUser.id);
    
    return this.mapUserToResponseDto(updatedUser, role.name);
  }

  async deleteUser(userId: string): Promise<void> {
    await this.userRepository.delete(userId);
    await this.userProfileRepository.delete(userId);
  }

  async getUserProfile(userId: string): Promise<UserProfileResponseDto> {
    const user = await this.userRepository.getById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const profile = await this.userProfileRepository.findByUserId(userId);
    const role = await this.roleService.getUserRole(user.id);
    const driverLicense = await this.driverLicenseRepository.findByUserId(userId);

    return {
      user: this.mapUserToResponseDto(user, role.name),
      profile: { ...profile },
      driverLicense: driverLicense ? {
        licenseNumber: driverLicense.licenseNumber,
        issueDate: driverLicense.issueDate,
        expirationDate: driverLicense.expirationDate,
      } : undefined,
    };
  }

  async updateUserProfile(userId: string, dto: UpdateProfileDto): Promise<UserProfileResponseDto> {
    const user = await this.userRepository.getById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    let profile = await this.userProfileRepository.findByUserId(userId);
    if (!profile) {
      profile = new UserProfile(randomUUID(), userId);
    }

    profile.updateProfile(dto.profilePicture, dto.city);
    await this.userProfileRepository.save(profile);

    return this.getUserProfile(userId);
  }

  private mapUserToResponseDto(user: any, role: string): UserResponseDto {
    return {
      id: user.id,
      email: user.email.getValue(),
      firstName: user.firstName,
      lastName: user.lastName,
      patronymic: user.patronymic || undefined,
      dateOfBirth: user.dateOfBirth,
      phone: user.phone || undefined,
      role,
      createdAt: user.createdAt,
      lastLoginAt: user.lastLoginAt || undefined,
    };
  }
}