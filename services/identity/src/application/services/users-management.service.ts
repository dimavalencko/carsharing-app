import { IUserRepository } from '@/domain/interfaces/repositories';
import { IPasswordHasher } from '@/domain/interfaces/services';
import {
  GetUserByIdUseCase,
  GetUserByLoginUseCase,
  UpdateUserProfileUseCase,
  ChangeUserPasswordUseCase,
  DeleteUserUseCase,
  GetAllUsersUseCase,
  GetUserByEmailUseCase,
  CreateUserUseCase,
  UpdateUserProfileDto,
  ChangeUserPasswordDto,
} from '../use-cases/users';
import { CreateUserDto } from '../dto/user/create-user.dto';
import { UpdateUserDto } from '../dto/user/update-user.dto';
import { UserMapper, UserResponseDto } from '../mappers';

export class UsersManagementService {
  private getUserByIdUseCase: GetUserByIdUseCase;
  private getUserByLoginUseCase: GetUserByLoginUseCase;
  private updateUserProfileUseCase: UpdateUserProfileUseCase;
  private changeUserPasswordUseCase: ChangeUserPasswordUseCase;
  private deleteUserUseCase: DeleteUserUseCase;
  private getAllUsersUseCase: GetAllUsersUseCase;
  private getUserByEmailUseCase: GetUserByEmailUseCase;
  private createUserUseCase: CreateUserUseCase;

  constructor(
    private userRepository: IUserRepository,
    private passwordHasher: IPasswordHasher,
  ) {
    this.getUserByIdUseCase = new GetUserByIdUseCase(userRepository);
    this.getUserByLoginUseCase = new GetUserByLoginUseCase(userRepository);
    this.updateUserProfileUseCase = new UpdateUserProfileUseCase(userRepository);
    this.changeUserPasswordUseCase = new ChangeUserPasswordUseCase(userRepository, passwordHasher);
    this.deleteUserUseCase = new DeleteUserUseCase(userRepository);
    this.getAllUsersUseCase = new GetAllUsersUseCase(userRepository);
    this.getUserByEmailUseCase = new GetUserByEmailUseCase(userRepository);
    this.createUserUseCase = new CreateUserUseCase(userRepository);
  }
  async createUser(dto: CreateUserDto): Promise<UserResponseDto> {
    const userAggregate = await this.createUserUseCase.execute(dto);
    return UserMapper.toResponseDto(userAggregate);
  }

  async getAll(): Promise<UserResponseDto[]> {
    const users = await this.getAllUsersUseCase.execute();
    return users.map(UserMapper.toResponseDto);
  }

  async getByEmail(email: string): Promise<UserResponseDto | null> {
    const userAggregate = await this.getUserByEmailUseCase.execute(email);
    return userAggregate ? UserMapper.toResponseDto(userAggregate) : null;
  }

  async updateUser(userId: string, dto: UpdateUserDto): Promise<UserResponseDto> {
    const userAggregate = await this.updateUserProfileUseCase.execute(userId, dto);
    return UserMapper.toResponseDto(userAggregate);
  }

  async getProfile(userId: string): Promise<UserResponseDto | null> {
    return this.getUserById(userId);
  }

  async getUserById(userId: string): Promise<UserResponseDto | null> {
    const userAggregate = await this.getUserByIdUseCase.execute(userId);
    return userAggregate ? UserMapper.toResponseDto(userAggregate) : null;
  }

  async getUserByLogin(login: string): Promise<UserResponseDto | null> {
    const userAggregate = await this.getUserByLoginUseCase.execute(login);
    return userAggregate ? UserMapper.toResponseDto(userAggregate) : null;
  }

  async updateUserProfile(
    userId: string,
    dto: UpdateUserProfileDto,
  ): Promise<UserResponseDto> {
    const userAggregate = await this.updateUserProfileUseCase.execute(
      userId,
      dto,
    );
    return UserMapper.toResponseDto(userAggregate);
  }

  async changeUserPassword(
    userId: string,
    dto: ChangeUserPasswordDto,
  ): Promise<void> {
    await this.changeUserPasswordUseCase.execute(userId, dto);
  }

  async deleteUser(userId: string): Promise<void> {
    await this.deleteUserUseCase.execute(userId);
  }
}
