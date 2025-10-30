import { UserAggregate } from '@/domain/aggregates/user';
import { IUserRepository } from '@/domain/interfaces/repositories';
import { IPasswordHasher } from '@/domain/interfaces/services';
import { UserRegistrationService } from '@/domain/services/user-registration.service';
import { RegisterUserDto } from '@/application/dto/auth/auth-request.dto';

export class RegisterUserUseCase {
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

  async execute(dto: RegisterUserDto): Promise<UserAggregate> {
    return await this.registrationService.registerUser({
      login: dto.username,
      password: dto.password,
      firstName: dto.firstName,
      lastName: dto.lastName,
      middleName: dto.middleName,
    });
  }
}
