import { UserRole } from '@domain/entities';
import { UserRoleEntity } from '../entities/user-role.entity';

export class UserRoleMapper {
  static toDomain(entity: UserRoleEntity): UserRole {
    return new UserRole(
      entity.id,
      entity.name,
    );
  }

  static toPersistence(role: UserRole): UserRoleEntity {
    const entity = new UserRoleEntity();
    entity.id = role.id;
    entity.name = role.name as any;
    return entity;
  }
}