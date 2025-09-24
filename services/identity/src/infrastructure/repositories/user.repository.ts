import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@domain/entities/user.entity';
import { IUserRepository } from '@domain/interfaces/IUserRepository';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(User)
    private readonly ormRepository: Repository<User>,
  ) {}

  async getAll(): Promise<User[]> {
    return this.ormRepository.find();
  }

  async getById(id: string): Promise<User | null> {
    return this.ormRepository.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.ormRepository.findOne({ where: { email } });
  }

  async save(user: User): Promise<User> {
    return this.ormRepository.save(user);
  }

  async update(id: string, userData: Partial<User>): Promise<User> {
    await this.ormRepository.update(id, userData);
    const updatedUser = await this.getById(id);
    
    if (!updatedUser) {
      throw new Error(`User with id ${id} not found after update`);
    }
    
    return updatedUser;
  }

  async delete(id: string): Promise<void> {
    await this.ormRepository.delete(id);
  }
}