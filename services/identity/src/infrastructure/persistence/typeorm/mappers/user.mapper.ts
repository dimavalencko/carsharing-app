import { User } from 'src/domain/entities/user.entity';
import { UserEntity } from '../entities/user.entity';
import { Email } from 'src/domain/value-objects/email.vo';
import { PasswordHash } from 'src/domain/value-objects/password-hash.vo';

export class UserMapper {
  static toDomain(entity: UserEntity): User {
    return new User(
      entity.id,
      new Email(entity.email),
      new PasswordHash(entity.passwordHash),
      entity.firstName,
      entity.lastName,
      entity.dateOfBirth,
      entity.roleId,
      entity.phone || null,
      entity.patronymic || null,
      entity.lastLoginAt || null,
      entity.createdAt,
      entity.updatedAt,
    );
  }

  static toPersistence(user: User): UserEntity {
    const entity = new UserEntity();
    entity.id = user.id;
    entity.email = user.email.getValue();
    entity.passwordHash = user.passwordHash.getValue();
    entity.firstName = user.firstName;
    entity.lastName = user.lastName;
    entity.patronymic = user.patronymic;
    entity.dateOfBirth = user.dateOfBirth;
    entity.phone = user.phone;
    entity.roleId = user.roleId;
    entity.lastLoginAt = user.lastLoginAt;
    entity.createdAt = user.createdAt;
    entity.updatedAt = user.updatedAt;
    return entity;
  }
}