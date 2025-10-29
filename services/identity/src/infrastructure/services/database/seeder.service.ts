import { Injectable, OnModuleInit, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import { User } from '@/domain/entities';
import { UserAggregate } from '@/domain/aggregates/user';
import type { IUserRepository } from '@/domain/interfaces/repositories';
import type { IPasswordHasher } from '@/domain/interfaces/services';
import { LoginValue, PasswordValue } from '@/domain/value-objects';

@Injectable()
export class SeederService implements OnModuleInit {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    @Inject('IPasswordHasher')
    private readonly passwordHasher: IPasswordHasher,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    await this.seedDefaultAdmin();
  }

  /**
   * Создает администратора по умолчанию при первом запуске системы
   */
  private async seedDefaultAdmin() {
    try {
      // Проверяем, есть ли пользователи в системе
      const users = await this.userRepository.findAll();
      
      if (users.length > 0) {
        console.log('⚠️  System already initialized. Skipping default admin creation.');
        return;
      }

      console.log('🔧 Initializing system: creating default administrator...');

      // Получаем данные администратора из переменных окружения
      const adminLogin = this.configService.get<string>('DEFAULT_ADMIN_LOGIN', 'admin');
      const adminPassword = this.configService.get<string>('DEFAULT_ADMIN_PASSWORD', 'admin123');
      const adminFirstName = this.configService.get<string>('DEFAULT_ADMIN_FIRSTNAME', 'System');
      const adminLastName = this.configService.get<string>('DEFAULT_ADMIN_LASTNAME', 'Administrator');

      // Хешируем пароль
      const passwordHash = await this.passwordHasher.hash(adminPassword);

      // Создаем администратора
      const adminId = uuidv4();
      const admin = User.createAdmin({
        login: LoginValue.create(adminLogin),
        password: PasswordValue.create(passwordHash),
        firstName: adminFirstName,
        lastName: adminLastName,
      }, adminId);

      const adminAggregate = UserAggregate.create(admin);
      await this.userRepository.save(adminAggregate);

      console.log('✅ Default administrator created successfully!');
      console.log(`   Login: ${adminLogin}`);
      console.log(`   Password: ${adminPassword}`);
      console.log('⚠️  IMPORTANT: Change the default password after first login!');
    } catch (error) {
      console.error('❌ Error creating default administrator:', error);
      throw error;
    }
  }
}