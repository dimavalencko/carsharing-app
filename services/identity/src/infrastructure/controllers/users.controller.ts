import { Controller, Param } from '@nestjs/common';
import { UsersService } from '@infrastructure/services/users.service';
import { CreateUserDto } from '@app/dto/user/create-user.dto';
import { UpdateUserDto } from '@app/dto/user/update-user.dto';
import { User } from '@domain/entities/user.entity';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { IdentityEndpoints } from '@carsharing/common';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern(IdentityEndpoints.USERS.GET_ALL)
  async getAll(): Promise<Array<Omit<User, 'passwordHash' | 'refreshToken'>>> {
    const users = await this.usersService.getAll();
    return users.map(user => this.sanitizeUser(user));
  }

  @MessagePattern(IdentityEndpoints.USERS.GET_BY_ID)
  async findOne(@Payload() id: string): Promise<Omit<User, 'passwordHash' | 'refreshToken'> | null> {
    console.log('---PAYLOAD DATA---', id);
    if(id == null) return null;
    const user = await this.usersService.getById(id);
    return user ? this.sanitizeUser(user) : null;
  }


  @MessagePattern(IdentityEndpoints.USERS.GET_BY_ID)
  async getUserById(@Payload() data: any): Promise<User | null> {
    console.log('---PAYLOAD DATA---', data);
    console.log('---PAYLOAD TYPE---', typeof data);
    console.log('---PIDOR TYPE---', typeof data);
    if(data === null || data === undefined) { 
      return null;
    }

    const user = await this.usersService.getById(data);
    return this.sanitizeUser(user);
  }


  @MessagePattern({ cmd: IdentityEndpoints.USERS.CREATE })
  async create(@Payload() createUserDto: CreateUserDto): Promise<Omit<User, 'passwordHash' | 'refreshToken'>> {
    const user = await this.usersService.create(createUserDto);
    return this.sanitizeUser(user);
  }







  @MessagePattern(IdentityEndpoints.USERS.UPDATE)
  async update(@Payload() data: { id: string; updateUserDto: UpdateUserDto }): Promise<Omit<User, 'passwordHash' | 'refreshToken'>> {
    const user = await this.usersService.update(data.id, data.updateUserDto);
    return this.sanitizeUser(user);
  }
  
  @MessagePattern(IdentityEndpoints.USERS.DELETE)
  async remove(@Payload() data: { id: string }): Promise<void> {
    return this.usersService.delete(data.id);
  }

  async activate(@Param('id') id: string): Promise<Omit<User, 'passwordHash' | 'refreshToken'>> {
    const user = await this.usersService.activateUser(id);
    return this.sanitizeUser(user);
  }

  async deactivate(@Param('id') id: string): Promise<Omit<User, 'passwordHash' | 'refreshToken'>> {
    const user = await this.usersService.deactivateUser(id);
    return this.sanitizeUser(user);
  }

  private sanitizeUser(user: User): any {
    return {
      id: user.id,
      email: user.email,
      phone: user.phone,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      profile: user.profile ? {
        firstName: user.profile.firstName,
        lastName: user.profile.lastName,
        patronymic: user.profile.patronymic,
        profilePicture: user.profile.profilePicture,
        fullName: user.profile.getFullName()
      } : null,
      driverLicense: user.driverLicense ? {
        licenseNumber: user.driverLicense.licenseNumber,
        firstName: user.driverLicense.firstName,
        lastName: user.driverLicense.lastName,
        patronymic: user.driverLicense.patronymic,
        birthDate: user.driverLicense.birthDate,
        issueDate: user.driverLicense.issueDate,
        expirationDate: user.driverLicense.expirationDate,
        isExpired: user.driverLicense.isExpired(),
        fullName: user.driverLicense.getFullName()
      } : null,
      role: user.role ? {
        id: user.role.id,
        name: user.role.name
      } : null,
    };
  }
}