import { UserRoles } from '@carsharing/common';

export interface IRoleService {
  getRoleById(id: string): Promise<UserRoles | null>;
  getRoleByName(name: string): Promise<UserRoles | null>;
  getAllRoles(): Promise<UserRoles[]>;
  
  getUserRole(userId: string): Promise<UserRoles>;
  userHasRole(userId: string, roleName: string): Promise<boolean>;
  isUserAdmin(userId: string): Promise<boolean>;
}