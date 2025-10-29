import { Repository } from 'typeorm';
import { IUserRepository } from '@/domain/interfaces/repositories';
import { UserAggregate } from '@/domain/aggregates/user';
import { UserEntity } from '../entities/user.entity';
import { UserMapper } from '../mappers/user.mapper';

export class UserRepository implements IUserRepository {
  constructor(private readonly ormRepo: Repository<UserEntity>) {}

  async findById(id: string): Promise<UserAggregate | null> {
    const entity = await this.ormRepo.findOne({
      where: { id },
      relations: { driverLicense: true },
    });
    return entity ? UserMapper.toDomain(entity) : null;
  }

  async findByLogin(login: string): Promise<UserAggregate | null> {
    const entity = await this.ormRepo.findOne({
      where: { login },
      relations: { driverLicense: true },
    });
    return entity ? UserMapper.toDomain(entity) : null;
  }

  async findByEmail(email: string): Promise<UserAggregate | null> {
    const entity = await this.ormRepo.findOne({
      where: { email },
      relations: { driverLicense: true },
    });
    return entity ? UserMapper.toDomain(entity) : null;
  }

  async findAll(): Promise<UserAggregate[]> {
    const entities = await this.ormRepo.find({
      relations: { driverLicense: true },
    });
    return entities.map((e) => UserMapper.toDomain(e));
  }

  async existsByLogin(login: string): Promise<boolean> {
    const count = await this.ormRepo.count({ where: { login } });
    return count > 0;
  }

  async existsByEmail(email: string): Promise<boolean> {
    const count = await this.ormRepo.count({ where: { email } });
    return count > 0;
  }

  async save(userAggregate: UserAggregate): Promise<void> {
    const entity = UserMapper.toPersistence(userAggregate);
    await this.ormRepo.save(entity);
  }

  async delete(id: string): Promise<void> {
    await this.ormRepo.delete({ id });
  }
}
