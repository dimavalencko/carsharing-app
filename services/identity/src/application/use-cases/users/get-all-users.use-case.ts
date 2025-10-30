import { IUserRepository } from '@/domain/interfaces/repositories';
import { UserAggregate } from '@/domain/aggregates/user';

export class GetAllUsersUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(): Promise<UserAggregate[]> {
    return this.userRepository.findAll();
  }
}
