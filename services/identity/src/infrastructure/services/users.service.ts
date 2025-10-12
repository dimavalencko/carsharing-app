import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IUsersService } from '@domain/interfaces/IUsersService';
import { User, Profile, Role } from '@domain/entities';
import type { IUserRepository } from '@domain/interfaces/IUserRepository';
import { UserRole } from '@carsharing/common';

@Injectable()
export class UsersService implements IUsersService {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository
  ) {}

  activateUser(id: string): Promise<User> {
    throw new Error('Method not implemented.');
  }
  deactivateUser(id: string): Promise<User> {
    throw new Error('Method not implemented.');
  }

  async getAll(): Promise<User[]> {
    return this.userRepository.getAll();
  }

  async getById(id: string): Promise<User> {
    const user = await this.userRepository.getById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
  }

  async create(userData: any): Promise<User> {
    // Создаем профиль
    const profile = Profile.create(
      userData.firstName,
      userData.lastName,
      userData.patronymic,
      userData.profilePicture
    );

    // Создаем пользователя
    const user = await User.create(
      userData.email,
      userData.phone,
      userData.password,
      profile,
      userData.role || await this.getDefaultRole()
    );

    return this.userRepository.save(user);
  }

  async update(id: string, userData: Partial<User>): Promise<User> {
    const user = await this.getById(id);
    
    // Обновляем поля
    if (userData.email) user.email = userData.email;
    if (userData.phone) user.phone = userData.phone;
    
    // Обновляем профиль
    if (userData.profile) {
      const profile = user.profile;
      if (userData.profile.firstName) profile.firstName = userData.profile.firstName;
      if (userData.profile.lastName) profile.lastName = userData.profile.lastName;
      if (userData.profile.patronymic) profile.patronymic = userData.profile.patronymic;
      if (userData.profile.profilePicture) profile.profilePicture = userData.profile.profilePicture;
    }

    return this.userRepository.save(user);
  }

  async delete(id: string): Promise<void> {
    const user = await this.getById(id);
    return this.userRepository.delete(id);
  }

  private async getDefaultRole(): Promise<Role> {
    // Здесь должна быть логика получения роли по умолчанию
    // Например, из базы данных или конфигурации
    const defaultRole = new Role();
    defaultRole.name = UserRole.UnauthorizedUser;
    return defaultRole;
  }
}