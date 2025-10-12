import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { IRoleService } from '@domain/interfaces/services';
import type { IUserRepository, IUserRoleRepository } from '@domain/interfaces/repositories';
import { UserRoles } from '@carsharing/common';
import { UserRole } from '@/domain/entities';

@Injectable()
export class RoleService implements IRoleService {
  constructor(
    @Inject('IUserRoleRepository') private readonly userRoleRepository: IUserRoleRepository,
    @Inject('IUserRepository') private readonly userRepository: IUserRepository,
  ) {}

  async getRoleById(id: string): Promise<UserRole | null> {
    return await this.userRoleRepository.findById(id);
  }

  async getRoleByName(name: string): Promise<UserRole | null> {
    return await this.userRoleRepository.findByName(name);
  }

  async getAllRoles(): Promise<UserRole[]> {
    return await this.userRoleRepository.getAll();
  }

  async getUserRole(userId: string): Promise<UserRole> {
    const user = await this.userRepository.getById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const role = await this.userRoleRepository.findById(user.roleId);
    if (!role) {
      throw new NotFoundException('User role not found');
    }

    return role;
  }

  async userHasRole(userId: string, roleName: string): Promise<boolean> {
    const role = await this.getUserRole(userId);
    return role.name === roleName;
  }

  async isUserAdmin(userId: string): Promise<boolean> {
    return await this.userHasRole(userId, UserRoles.Admin);
  }
}