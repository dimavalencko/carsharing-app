import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Role, User } from '@domain/entities';
import { UserRole } from '@carsharing/common';
import { users } from './data/mock-users';

@Injectable()
export class SeederService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async seedAll() {
    await this.seedRoles();
  }

  async seedRoles() {
    const roleRepository = this.dataSource.getRepository(Role);
  
    // Получаем все роли из enum
    const rolesToSeed = Object.values(UserRole).map(roleName => {
      const role = new Role();
      role.name = roleName;
      return role;
    });
  
    try {
      await roleRepository
        .createQueryBuilder()
        .insert()
        .into(Role)
        .values(rolesToSeed)
        .orIgnore()
        .execute();
  
      console.log('✅Roles have been seeded.');
    } 
    catch (error) {
      console.error('❌Error seeding roles:', error);
    }
  }

  async seedUsers() {
    const usersRepository = this.dataSource.getRepository(User);
  
    // Получаем все роли из enum
    const usersToSeed = users.map((usr) => {
      let role = new Role();
      role.name = usr.role.name as UserRole;

      const user = {
        email: usr.email, 
        phone: usr.phone, 
        password: usr.password, 
        profile: usr.profile, 
        role: role
      } as User;
      return user;
    })
  
    try {
      await usersRepository
        .createQueryBuilder()
        .insert()
        .into(Role)
        .values(usersToSeed)
        .orIgnore()
        .execute();
  
      console.log('✅Roles have been seeded.');
    } 
    catch (error) {
      console.error('❌Error seeding roles:', error);
    }
  }
}