import { UserRole } from "@domain/entities";

export interface IUserRoleRepository {
  findById(id: string): Promise<UserRole | null>;
  findByName(name: string): Promise<UserRole | null>;
  getAll(): Promise<UserRole[]>;
}