import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { IUserRepository, IUserProfileRepository, IDriverLicenseRepository, IRefreshTokenRepository, } from '@domain/interfaces/repositories';
import type { IRoleService, IAdminService } from '@domain/interfaces/services';
import { UserDetailsDto, SystemStatsDto, UserResponseDto, DriverLicenseResponseDto } from '@carsharing/common';

@Injectable()
export class AdminService implements IAdminService {
  constructor(
    @Inject('IUserRepository') private readonly userRepository: IUserRepository,
    @Inject('IUserProfileRepository') private readonly userProfileRepository: IUserProfileRepository,
    @Inject('IDriverLicenseRepository') private readonly driverLicenseRepository: IDriverLicenseRepository,
    @Inject('IRefreshTokenRepository') private readonly refreshTokenRepository: IRefreshTokenRepository,
    @Inject('IRoleService') private readonly roleService: IRoleService,
  ) {}

async getAllUsers(): Promise<UserResponseDto[]> {
    const users = await this.userRepository.getAll();
    const userDtos: UserResponseDto[] = [];

    for (const user of users) {
      const role = await this.roleService.getUserRole(user.id);
      userDtos.push({
        id: user.id,
        email: user.email.getValue(),
        firstName: user.firstName,
        lastName: user.lastName,
        patronymic: user.patronymic || undefined,
        dateOfBirth: user.dateOfBirth,
        phone: user.phone || undefined,
        role: role.name,
        createdAt: user.createdAt,
        lastLoginAt: user.lastLoginAt || undefined,
      });
    }

    return userDtos;
  }

  async getUserDetails(userId: string): Promise<UserDetailsDto> {
    const user = await this.userRepository.getById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const profile = await this.userProfileRepository.findByUserId(userId);
    const driverLicense = await this.driverLicenseRepository.findByUserId(userId);
    const role = await this.roleService.getUserRole(user.id);
    const canRentCar = !!driverLicense && !driverLicense.isExpired();

    return {
      user: {
        id: user.id,
        email: user.email.getValue(),
        firstName: user.firstName,
        lastName: user.lastName,
        patronymic: user.patronymic || undefined,
        dateOfBirth: user.dateOfBirth,
        phone: user.phone || undefined,
        role: role.name,
        createdAt: user.createdAt,
        lastLoginAt: user.lastLoginAt || undefined,
      },
      profile: { ...profile },
      driverLicense: driverLicense ? {
        id: driverLicense.id,
        licenseNumber: driverLicense.licenseNumber,
        issueDate: driverLicense.issueDate,
        expirationDate: driverLicense.expirationDate,
        createdAt: driverLicense.createdAt,
        updatedAt: driverLicense.updatedAt,
      } : undefined,
      canRentCar,
    };
  }
  async getUserDriverLicense(userId: string): Promise<DriverLicenseResponseDto | null> {
    const license = await this.driverLicenseRepository.findByUserId(userId);
    if (!license) {
      return null;
    }

    return {
      id: license.id,
      licenseNumber: license.licenseNumber,
      issueDate: license.issueDate,
      expirationDate: license.expirationDate,
      createdAt: license.createdAt,
      updatedAt: license.updatedAt,
    };
  }

  async getSystemStats(): Promise<SystemStatsDto> {
    const users = await this.userRepository.getAll();
    const totalUsers = users.length;
    
    let usersWithLicenses = 0;
    for (const user of users) {
      if (await this.driverLicenseRepository.existsForUser(user.id)) {
        usersWithLicenses++;
      }
    }

    const activeSessions = await this.getActiveSessionsCount();

    return {
      totalUsers,
      usersWithLicenses,
      activeSessions,
    };
  }

  async getActiveSessionsCount(): Promise<number> {
    const users = await this.userRepository.getAll();
    let activeSessions = 0;

    for (const user of users) {
      const tokens = await this.refreshTokenRepository.findByUserId(user.id);
      const validTokens = tokens.filter(token => token.isValid());
      activeSessions += validTokens.length;
    }

    return activeSessions;
  }

  async forceLogoutUser(userId: string): Promise<void> {
    await this.refreshTokenRepository.revokeAllForUser(userId);
  }

  async getUserLoginHistory(userId: string): Promise<any[]> {
    const tokens = await this.refreshTokenRepository.findByUserId(userId);
    return tokens.map(token => ({
      createdAt: token.createdAt,
      userAgent: token.userAgent,
      ipAddress: token.ipAddress,
      expiresAt: token.expiresAt,
      isRevoked: token.isRevoked,
    }));
  }
}