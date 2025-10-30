import { UserAggregate } from '@/domain/aggregates/user';
import { IUserRepository } from '@/domain/interfaces/repositories';

export class GetAllUsersByAdminUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(adminId: string): Promise<UserAggregate[]> {
    // Проверяем, что вызывающий - администратор
    const adminAggregate = await this.userRepository.findById(adminId);

    if (!adminAggregate) {
      throw new Error('Admin not found');
    }

    const admin = adminAggregate.getUser();
    if (!admin.isAdministrator()) {
      throw new Error('Only administrators can view all users');
    }

    // Получаем всех пользователей
    return await this.userRepository.findAll();
  }
}
