import { IUserRepository } from "@/domain/interfaces/repositories";
import { IPasswordHasher } from "@/domain/interfaces/services";
import {
  CreateUserByAdminUseCase,
  CreateAdminByAdminUseCase,
  DeleteUserByAdminUseCase,
  GetAllUsersByAdminUseCase,
  CreateUserByAdminDto,
  CreateAdminDto
} from "../use-cases/admin";
import { UserMapper, UserResponseDto } from "../mappers";

export class AdminManagementService {
  private createUserByAdminUseCase: CreateUserByAdminUseCase;
  private createAdminByAdminUseCase: CreateAdminByAdminUseCase;
  private deleteUserByAdminUseCase: DeleteUserByAdminUseCase;
  private getAllUsersByAdminUseCase: GetAllUsersByAdminUseCase;

  constructor(
    private userRepository: IUserRepository,
    private passwordHasher: IPasswordHasher
  ) {
    this.createUserByAdminUseCase = new CreateUserByAdminUseCase(
      userRepository,
      passwordHasher
    );
    this.createAdminByAdminUseCase = new CreateAdminByAdminUseCase(
      userRepository,
      passwordHasher
    );
    this.deleteUserByAdminUseCase = new DeleteUserByAdminUseCase(userRepository);
    this.getAllUsersByAdminUseCase = new GetAllUsersByAdminUseCase(userRepository);
  }

  async createUser(adminId: string, dto: CreateUserByAdminDto): Promise<UserResponseDto> {
    const userAggregate = await this.createUserByAdminUseCase.execute(adminId, dto);
    return UserMapper.toResponseDto(userAggregate);
  }

  async createAdmin(adminId: string, dto: CreateAdminDto): Promise<UserResponseDto> {
    const adminAggregate = await this.createAdminByAdminUseCase.execute(adminId, dto);
    return UserMapper.toResponseDto(adminAggregate);
  }

  async deleteUser(adminId: string, userIdToDelete: string): Promise<void> {
    await this.deleteUserByAdminUseCase.execute(adminId, userIdToDelete);
  }

  async getAllUsers(adminId: string): Promise<UserResponseDto[]> {
    const userAggregates = await this.getAllUsersByAdminUseCase.execute(adminId);
    return userAggregates.map(aggregate => UserMapper.toResponseDto(aggregate));
  }
}
