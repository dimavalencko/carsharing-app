import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Role } from '@domain/entities';
import { UserRole } from '@carsharing/common';

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
}