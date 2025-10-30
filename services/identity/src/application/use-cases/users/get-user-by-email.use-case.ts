import { IUserRepository } from '@/domain/interfaces/repositories';
import { UserAggregate } from '@/domain/aggregates/user';

export class GetUserByEmailUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(email: string): Promise<UserAggregate | null> {
    return this.userRepository.findByEmail(email);
  }
}
