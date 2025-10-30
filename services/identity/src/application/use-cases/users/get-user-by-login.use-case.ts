import { UserAggregate } from '@/domain/aggregates/user';
import { IUserRepository } from '@/domain/interfaces/repositories';

export class GetUserByLoginUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(login: string): Promise<UserAggregate | null> {
    return await this.userRepository.findByLogin(login);
  }
}
