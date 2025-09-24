import { User } from '../entities/user.entity';

export interface IUsersService {
  getAll(): Promise<User[]>;
  getById(id: string): Promise<User>;
  create(userData: Partial<User>): Promise<User>;
  update(id: string, userData: Partial<User>): Promise<User>;
  delete(id: string): Promise<void>;
  activateUser(id: string): Promise<User>;
  deactivateUser(id: string): Promise<User>;
}