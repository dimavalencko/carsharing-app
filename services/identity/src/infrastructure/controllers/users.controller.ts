import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch,
  Param, 
  Delete, 
  UseGuards,
  HttpCode,
  HttpStatus 
} from '@nestjs/common';
import { UsersService } from '@infrastructure/services/users.service';
import { CreateUserDto } from '@app/dto/user/create-user.dto';
import { UpdateUserDto } from '@app/dto/user/update-user.dto';
import { JwtAuthGuard } from '@app/guards/jwt-auth.guard';
import { User } from '@domain/entities/user.entity';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto): Promise<Omit<User, 'passwordHash' | 'refreshToken'>> {
    const user = await this.usersService.create(createUserDto);
    return this.sanitizeUser(user);
  }

  @Get()
  async findAll(): Promise<Array<Omit<User, 'passwordHash' | 'refreshToken'>>> {
    const users = await this.usersService.findAll();
    return users.map(user => this.sanitizeUser(user));
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Omit<User, 'passwordHash' | 'refreshToken'>> {
    const user = await this.usersService.findById(id);
    return this.sanitizeUser(user);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string, 
    @Body() updateUserDto: UpdateUserDto
  ): Promise<Omit<User, 'passwordHash' | 'refreshToken'>> {
    const user = await this.usersService.update(id, updateUserDto);
    return this.sanitizeUser(user);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    return this.usersService.delete(id);
  }

  @Post(':id/activate')
  async activate(@Param('id') id: string): Promise<Omit<User, 'passwordHash' | 'refreshToken'>> {
    const user = await this.usersService.activateUser(id);
    return this.sanitizeUser(user);
  }

  @Post(':id/deactivate')
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