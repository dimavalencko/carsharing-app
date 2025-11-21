import { UserAggregate } from '@/domain/aggregates/user';
import { IUserRepository } from '@/domain/interfaces/repositories';
import { IPasswordHasher } from '@/domain/interfaces/services';
import { UserRegistrationService } from '@/domain/services/user-registration.service';

export interface CreateUserByAdminDto {
  username: string;
  password: string;
  firstName: string;
  lastName?: string;
  middleName?: string;
}

export class CreateUserByAdminUseCase {
  private registrationService: UserRegistrationService;

  constructor(
    private userRepository: IUserRepository,
    private passwordHasher: IPasswordHasher,
  ) {
    this.registrationService = new UserRegistrationService(
      userRepository,
      passwordHasher,
    );
  }

  async execute(
    adminId: string,
    dto: CreateUserByAdminDto,
  ): Promise<UserAggregate> {
    // Проверяем, что вызывающий - администратор
    const adminAggregate = await this.userRepository.findById(adminId);

    if (!adminAggregate) {
      throw new Error('Admin not found');
    }

    const admin = adminAggregate.getUser();
    
    // Добавляем подробное логирование для отладки
    console.log('Admin role:', admin.getRole());
    console.log('Is administrator:', admin.isAdministrator());
    
    if (!admin.isAdministrator()) {
      throw new Error(`Admin access required. Current role: ${admin.getRole()}`);
    }

    // Создаем обычного пользователя
    return await this.registrationService.registerUser({
      login: dto.username,
      password: dto.password,
      firstName: dto.firstName,
      lastName: dto.lastName,
      middleName: dto.middleName,
    });
  }
}
