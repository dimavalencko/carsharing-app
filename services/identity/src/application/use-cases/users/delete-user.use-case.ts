import { IUserRepository } from '@/domain/interfaces/repositories';

export class DeleteUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(userId: string): Promise<void> {
    const userAggregate = await this.userRepository.findById(userId);

    if (!userAggregate) {
      throw new Error('User not found');
    }

    // Пользователь может удалить только сам себя (не администратора)
    // Администраторов могут удалять только другие администраторы через AdminManagementService
    const user = userAggregate.getUser();
    if (user.isAdministrator()) {
      throw new Error('Administrators cannot be deleted through this endpoint');
    }

    await this.userRepository.delete(userId);
  }
}
