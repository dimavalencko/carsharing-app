import { UserAggregate } from "@/domain/aggregates/user";
import { IUserRepository } from "@/domain/interfaces/repositories";
import { IPasswordHasher } from "@/domain/interfaces/services";
import { UserRegistrationService } from "@/domain/services/user-registration.service";

export interface CreateAdminDto {
  username: string;
  password: string;
  firstName: string;
  lastName?: string;
  middleName?: string;
}

export class CreateAdminByAdminUseCase {
  private registrationService: UserRegistrationService;

  constructor(
    private userRepository: IUserRepository,
    private passwordHasher: IPasswordHasher
  ) {
    this.registrationService = new UserRegistrationService(
      userRepository,
      passwordHasher
    );
  }

  async execute(adminId: string, dto: CreateAdminDto): Promise<UserAggregate> {
    // Проверяем, что вызывающий - администратор
    const adminAggregate = await this.userRepository.findById(adminId);
    
    if (!adminAggregate) {
      throw new Error('Admin not found');
    }

    const admin = adminAggregate.getUser();
    if (!admin.isAdministrator()) {
      throw new Error('Only administrators can create other administrators');
    }

    // Создаем администратора
    return await this.registrationService.createAdminUser({
      login: dto.username,
      password: dto.password,
      firstName: dto.firstName,
      lastName: dto.lastName,
      middleName: dto.middleName
    });
  }
}
