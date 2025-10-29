import { IUserRepository } from "@/domain/interfaces/repositories";

export class DeleteUserByAdminUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(adminId: string, userIdToDelete: string): Promise<void> {
    // Проверяем, что вызывающий - администратор
    const adminAggregate = await this.userRepository.findById(adminId);
    
    if (!adminAggregate) {
      throw new Error('Admin not found');
    }

    const admin = adminAggregate.getUser();
    if (!admin.isAdministrator()) {
      throw new Error('Only administrators can delete users');
    }

    // Нельзя удалить самого себя
    if (adminId === userIdToDelete) {
      throw new Error('Administrator cannot delete themselves');
    }

    // Проверяем, что пользователь существует
    const userToDeleteAggregate = await this.userRepository.findById(userIdToDelete);
    if (!userToDeleteAggregate) {
      throw new Error('User not found');
    }

    // Удаляем пользователя
    await this.userRepository.delete(userIdToDelete);
  }
}
