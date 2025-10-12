import { UserProfile } from "@/domain/entities";

export interface IUserProfileRepository {
  findByUserId(userId: string): Promise<UserProfile | null>;
  save(profile: UserProfile): Promise<UserProfile>;
  delete(userId: string): Promise<void>;
}