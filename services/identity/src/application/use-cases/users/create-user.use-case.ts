import { IUserRepository } from '@/domain/interfaces/repositories';
import { UserAggregate } from '@/domain/aggregates/user';
import { CreateUserDto } from '../../dto/user/create-user.dto';
import { User } from '@/domain/entities/user.entity';
import { v4 as uuidv4 } from 'uuid';
import { LoginValue } from '@/domain/value-objects/login.vo';
import { PasswordValue } from '@/domain/value-objects/password.vo';
import { EmailValue } from '@/domain/value-objects/email.vo';
import { PhoneNumberValue } from '@/domain/value-objects/phone-number.vo';

export class CreateUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(dto: CreateUserDto): Promise<UserAggregate> {
    const id = uuidv4();
    const user = User.create({
      login: LoginValue.create(dto.username),
      password: PasswordValue.create(dto.password),
      firstName: dto.firstName,
      lastName: dto.lastName,
      middleName: dto.middleName,
      email: dto.email ? EmailValue.create(dto.email) : undefined,
      phoneNumber: dto.phoneNumber ? PhoneNumberValue.create(dto.phoneNumber) : undefined,
      birthDate: dto.birthDate,
      city: dto.city,
      avatarUrl: dto.avatarUrl,
    }, id);
    const aggregate = UserAggregate.create(user);
    await this.userRepository.save(aggregate);
    return aggregate;
  }
}
