// src/application/services/driver-license.service.ts
import { Injectable, Inject, NotFoundException, ConflictException, } from '@nestjs/common';
import type { IUserRepository, IDriverLicenseRepository, } from '@domain/interfaces/repositories';
import type { IDriverLicenseService } from '@domain/interfaces/services';
import { CreateDriverLicenseDto, DriverLicenseResponseDto, UpdateDriverLicenseDto } from '@carsharing/common';

import { DriverLicense } from 'src/domain/entities/driver-license.entity';
import { randomUUID } from 'crypto';

@Injectable()
export class DriverLicenseService implements IDriverLicenseService {
  constructor(
    @Inject('IDriverLicenseRepository') private readonly driverLicenseRepository: IDriverLicenseRepository,
    @Inject('IUserRepository') private readonly userRepository: IUserRepository,
  ) {}

  async createDriverLicense(userId: string, dto: CreateDriverLicenseDto): Promise<DriverLicenseResponseDto> {
    const user = await this.userRepository.getById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const existingLicense = await this.driverLicenseRepository.findByUserId(userId);
    if (existingLicense) {
      throw new ConflictException('Driver license already exists for this user');
    }

    const license = new DriverLicense(
      randomUUID(),
      userId,
      dto.licenseNumber,
      dto.issueDate,
      dto.expirationDate,
    );

    const savedLicense = await this.driverLicenseRepository.save(license);
    return this.mapToResponseDto(savedLicense);
  }

  async getDriverLicense(userId: string): Promise<DriverLicenseResponseDto | null> {
    const license = await this.driverLicenseRepository.findByUserId(userId);
    if (!license) {
      return null;
    }
    return this.mapToResponseDto(license);
  }

  async updateDriverLicense(userId: string, dto: UpdateDriverLicenseDto): Promise<DriverLicenseResponseDto> {
    const license = await this.driverLicenseRepository.findByUserId(userId);
    if (!license) {
      throw new NotFoundException('Driver license not found');
    }

    license.updateLicenseInfo(
      dto.licenseNumber || license.licenseNumber,
      dto.issueDate || license.issueDate,
      dto.expirationDate || license.expirationDate,
    );

    const updatedLicense = await this.driverLicenseRepository.save(license);
    return this.mapToResponseDto(updatedLicense);
  }

  async deleteDriverLicense(userId: string): Promise<void> {
    await this.driverLicenseRepository.delete(userId);
  }

  async canUserRentCar(userId: string): Promise<boolean> {
    return await this.hasValidDriverLicense(userId);
  }

  async hasValidDriverLicense(userId: string): Promise<boolean> {
    const license = await this.driverLicenseRepository.findByUserId(userId);
    if (!license) {
      return false;
    }
    return !license.isExpired();
  }

  async getDriverLicenseStatus(userId: string): Promise<{ hasLicense: boolean; isValid: boolean }> {
    const license = await this.driverLicenseRepository.findByUserId(userId);
    if (!license) {
      return { hasLicense: false, isValid: false };
    }
    return { hasLicense: true, isValid: !license.isExpired() };
  }

  private mapToResponseDto(license: DriverLicense): DriverLicenseResponseDto {
    return {
      id: license.id,
      licenseNumber: license.licenseNumber,
      issueDate: license.issueDate,
      expirationDate: license.expirationDate,
      createdAt: license.createdAt,
      updatedAt: license.updatedAt,
    };
  }
}