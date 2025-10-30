import { UserAggregate } from '@/domain/aggregates/user';
import { User } from '@/domain/entities/user.entity';
import { DriverLicense } from '@/domain/entities/driver-license.entity';
import {
  LoginValue,
  PasswordValue,
  EmailValue,
  PhoneNumberValue,
} from '@/domain/value-objects';
import { UserEntity } from '../entities/user.entity';
import { UserRoles } from '@/domain/enums';
import { DriverLicenseMapper } from './driver-license.mapper';

export class UserMapper {
  /**
   * Преобразование Domain Aggregate -> TypeORM Entity
   */
  static toPersistence(aggregate: UserAggregate): UserEntity {
    const user = aggregate.getUser();

    const entity = new UserEntity();
    entity.id = user.getId();
    entity.login = user.getLogin().getValue();
    entity.password = user.getPassword().getValue();
    entity.firstName = user.getFirstName();
    entity.lastName = user.getLastName();
    entity.middleName = user.getMiddleName();
    entity.email = user.getEmail()?.getValue();
    entity.phoneNumber = user.getPhoneNumber()?.getValue();
    entity.birthDate = user.getBirthDate();
    entity.city = user.getCity();
    entity.avatarUrl = user.getAvatarUrl();
    entity.role = user.getRole();
    entity.createdAt = user.getCreatedAt();
    entity.updatedAt = user.getUpdatedAt();

    // Driver License
    const driverLicense = aggregate.getDriverLicense();
    if (driverLicense) {
      entity.driverLicense = DriverLicenseMapper.toPersistence(driverLicense);
    }

    return entity;
  }

  /**
   * Преобразование TypeORM Entity -> Domain Aggregate
   */
  static toDomain(entity: UserEntity): UserAggregate {
    const user = User.reconstitute(entity.id, {
      login: LoginValue.create(entity.login),
      password: PasswordValue.create(entity.password),
      firstName: entity.firstName,
      lastName: entity.lastName,
      middleName: entity.middleName,
      email: entity.email ? EmailValue.create(entity.email) : undefined,
      phoneNumber: entity.phoneNumber
        ? PhoneNumberValue.create(entity.phoneNumber)
        : undefined,
      birthDate: entity.birthDate,
      city: entity.city,
      avatarUrl: entity.avatarUrl,
      role: entity.role as UserRoles,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });

    // Driver License
    let driverLicense: DriverLicense | undefined;
    if (entity.driverLicense) {
      driverLicense = DriverLicenseMapper.toDomain(entity.driverLicense);
    }

    return UserAggregate.create(user, driverLicense);
  }
}
