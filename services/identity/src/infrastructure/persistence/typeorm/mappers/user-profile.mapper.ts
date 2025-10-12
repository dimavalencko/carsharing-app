import { UserProfile } from '@domain/entities';
import { UserProfileEntity } from '../entities/user-profile.entity';

export class UserProfileMapper {
  static toDomain(entity: UserProfileEntity): UserProfile {
    return new UserProfile(
      entity.id,
      entity.userId,
      entity.profilePicture,
      entity.city,
      entity.createdAt,
      entity.updatedAt,
    );
  }

  static toPersistence(profile: UserProfile): UserProfileEntity {
    const entity = new UserProfileEntity();
    entity.id = profile.id;
    entity.userId = profile.userId;
    entity.profilePicture = profile.profilePicture as string;
    entity.city = profile.city as string;
    entity.createdAt = profile.createdAt;
    entity.updatedAt = profile.updatedAt;
    return entity;
  }
}