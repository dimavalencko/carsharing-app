import { UserAggregate } from '@/domain/aggregates/user';

export interface IUserRepository {
  findById(id: string): Promise<UserAggregate | null>;
  findByLogin(login: string): Promise<UserAggregate | null>;
  findByEmail(email: string): Promise<UserAggregate | null>;
  save(userAggregate: UserAggregate): Promise<void>;
  delete(id: string): Promise<void>;
  existsByLogin(login: string): Promise<boolean>;
  existsByEmail(email: string): Promise<boolean>;
}