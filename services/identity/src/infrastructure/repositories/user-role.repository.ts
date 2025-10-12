import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IUserRoleRepository } from '@domain/interfaces/repositories';
import { UserRole } from '@domain/entities';
import { UserRoleMapper } from '../persistence/typeorm/mappers/user-role.mapper';
import { UserRoleEntity } from '../persistence/typeorm/entities/user-role.entity';
import { UserRoles } from '@carsharing/common';

@Injectable()
export class UserRoleRepository implements IUserRoleRepository {
  constructor(
    @InjectRepository(UserRoleEntity)
    private readonly repository: Repository<UserRoleEntity>,
  ) {}

  async findById(id: string): Promise<UserRole | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? UserRoleMapper.toDomain(entity) : null;
  }
  
  async findByName(name: string): Promise<UserRole | null> {
    const roleName = name as UserRoles;
    const entity = await this.repository.findOne({ where: { name: roleName } });
    return entity ? UserRoleMapper.toDomain(entity) : null;
  }

  async getAll(): Promise<UserRole[]> {
    const entities = await this.repository.find();
    return entities.map(entity => UserRoleMapper.toDomain(entity));
  }
}