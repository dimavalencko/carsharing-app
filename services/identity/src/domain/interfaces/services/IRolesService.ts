import { UserRole } from '@domain/entities';

export interface IRoleService {
  getRoleById(id: string): Promise<UserRole | null>;
  getRoleByName(name: string): Promise<UserRole | null>;
  getAllRoles(): Promise<UserRole[]>;
  
  getUserRole(userId: string): Promise<UserRole>;
  userHasRole(userId: string, roleName: string): Promise<boolean>;
  isUserAdmin(userId: string): Promise<boolean>;
}