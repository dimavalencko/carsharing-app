import { UserAggregate } from "@/domain/aggregates/user";
import { IUserRepository } from "@/domain/interfaces/repositories";

export class GetUserByIdUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(userId: string): Promise<UserAggregate | null> {
    return await this.userRepository.findById(userId);
  }
}
