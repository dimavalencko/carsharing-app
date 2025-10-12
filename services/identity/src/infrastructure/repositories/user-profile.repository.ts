import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IUserProfileRepository } from '@domain/interfaces/repositories';
import { UserProfile } from '@domain/entities';
import { UserProfileEntity } from '../persistence/typeorm/entities';
import { UserProfileMapper } from '../persistence/typeorm/mappers';


@Injectable()
export class UserProfileRepository implements IUserProfileRepository {
  constructor(
    @InjectRepository(UserProfileEntity)
    private readonly repository: Repository<UserProfileEntity>,
  ) {}

  async findByUserId(userId: string): Promise<UserProfile | null> {
    const entity = await this.repository.findOne({ where: { userId } });
    return entity ? UserProfileMapper.toDomain(entity) : null;
  }

  async save(profile: UserProfile): Promise<UserProfile> {
    const entity = UserProfileMapper.toPersistence(profile);
    const savedEntity = await this.repository.save(entity);
    return UserProfileMapper.toDomain(savedEntity);
  }

  async delete(userId: string): Promise<void> {
    await this.repository.delete({ userId });
  }
}