import { v4 as uuidv4 } from 'uuid';
import { UserAggregate } from "../aggregates/user";
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

    const userId = uuidv4();
    const user = User.create({
      login: LoginValue.create(command.login),
      password: PasswordValue.create(passwordHash),
      firstName: command.firstName,
      lastName: command.lastName,
      middleName: command.middleName
    }, userId);

    const userAggregate = UserAggregate.create(user);
    await this.userRepository.save(userAggregate);

    return userAggregate;
  }

  async createAdminUser(command: {
    login: string;
    password: string;
    firstName: string;
    lastName?: string;
    middleName?: string;
  }) {
    if (await this.userRepository.existsByLogin(command.login)) {
      throw new Error('User with this login already exists');
    }

    const passwordHash = await this.passwordHasher.hash(command.password);

    const adminId = uuidv4();
    const user = User.createAdmin({
      login: LoginValue.create(command.login),
      password: PasswordValue.create(passwordHash),
      firstName: command.firstName,
      lastName: command.lastName,
      middleName: command.middleName
    }, adminId);
    
    const userAggregate = UserAggregate.create(user);
    await this.userRepository.save(userAggregate);

    return userAggregate;
  }
}