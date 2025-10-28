import { UserAggregate } from "../aggreagates/user";
import { User } from "../entities";
import { IUserRepository } from "../interfaces/repositories";
import { IPasswordHasher } from "../interfaces/services";
import { LoginValue, PasswordValue } from "../value-objects";

export class UserRegistrationService {
  constructor(
    private userRepository: IUserRepository,
    private passwordHasher: IPasswordHasher
  ) {}

  async registerUser(command: {
    login: string;
    password: string;
    firstName: string;
    lastName?: string;
    middleName?: string;
  }): Promise<UserAggregate> {
    // Валидация уникальности логина
    if (await this.userRepository.existsByLogin(command.login)) {
      throw new Error('User with this login already exists');
    }

    // Хеширование пароля
    const passwordHash = await this.passwordHasher.hash(command.password);

    const user = User.create({
      login: LoginValue.create(command.login),
      password: PasswordValue.create(passwordHash),
      firstName: command.firstName,
      lastName: command.lastName,
      middleName: command.middleName
    });

    const userAggregate = UserAggregate.create(user);
    await this.userRepository.save(userAggregate);

    return userAggregate;
  }
}