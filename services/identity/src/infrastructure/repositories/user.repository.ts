// src/infrastructure/persistence/repositories/user.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IUserRepository } from '@domain/interfaces/repositories';
import { User } from 'src/domain/entities/user.entity';
import { UserEntity, UserMapper } from '../persistence/typeorm';
import { Email } from '@domain/value-objects/email.vo';


@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>,
  ) {}

  async getAll(): Promise<User[]> {
    const entities = await this.repository.find({ relations: ['role'] });
    return entities.map(entity => UserMapper.toDomain(entity));
  }

  async getById(id: string): Promise<User | null> {
    const entity = await this.repository.findOne({ 
      where: { id },
      relations: ['role']
    });
    return entity ? UserMapper.toDomain(entity) : null;
  }

  async findByEmail(email: Email): Promise<User | null> {
    const entity = await this.repository.findOne({
      where: { email: email.getValue() },
      relations: ['role']
    });
    return entity ? UserMapper.toDomain(entity) : null;
  }

  async save(user: User): Promise<User> {
    const entity = UserMapper.toPersistence(user);
    const savedEntity = await this.repository.save(entity);
    return UserMapper.toDomain(savedEntity);
  }

  async update(id: string, user: Partial<User>): Promise<User> {
    await this.repository.update(id, UserMapper.toPersistence(user as User));
    const updatedEntity = await this.repository.findOne({ 
      where: { id },
      relations: ['role']
    });
    if (!updatedEntity) {
      throw new Error('User not found after update');
    }
    return UserMapper.toDomain(updatedEntity);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}