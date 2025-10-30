import { IUserRepository } from '@/domain/interfaces/repositories';
import { IPasswordHasher } from '@/domain/interfaces/services';
import { PasswordValue } from '@/domain/value-objects';

export interface ChangeUserPasswordDto {
  oldPassword: string;
  newPassword: string;
}

export class ChangeUserPasswordUseCase {
  constructor(
    private userRepository: IUserRepository,
    private passwordHasher: IPasswordHasher,
  ) {}

  async execute(userId: string, dto: ChangeUserPasswordDto): Promise<void> {
    const userAggregate = await this.userRepository.findById(userId);

    if (!userAggregate) {
      throw new Error('User not found');
    }

    const user = userAggregate.getUser();

    // Проверяем старый пароль
    const isOldPasswordValid = await this.passwordHasher.compare(
      dto.oldPassword,
      user.getPassword().getValue(),
    );

    if (!isOldPasswordValid) {
      throw new Error('Invalid old password');
    }

    // Хешируем новый пароль
    const newPasswordHash = await this.passwordHasher.hash(dto.newPassword);
    const newPassword = PasswordValue.create(newPasswordHash);

    user.changePassword(newPassword);
    await this.userRepository.save(userAggregate);
  }
}
