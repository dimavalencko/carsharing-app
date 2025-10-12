import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { DriverLicenseEntity, UserEntity, UserProfileEntity, UserRoleEntity } from '@infrastructure/persistence/typeorm/entities';
import { UserRoles } from '@carsharing/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeederService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async seedAll() {
    await this.seedRoles();
    await this.seedUsers();
  }

  async seedRoles() {
    console.log('🔍 Debug: Starting seedRoles');
    console.log('🔍 UserRoleEntity:', UserRoleEntity);
    console.log('🔍 UserRoles enum:', UserRoles);
    const roleRepository = this.dataSource.getRepository(UserRoleEntity);
    console.log('🔍 Repository obtained');
  
    // Получаем все роли из enum
    const rolesToSeed = Object.values(UserRoles).map(roleName => {
      const role = new UserRoleEntity();
      role.name = roleName;
      return role;
    });
  
    try {
      await roleRepository
        .createQueryBuilder()
        .insert()
        .into(UserRoleEntity)
        .values(rolesToSeed)
        .orIgnore()
        .execute();
  
      console.log('✅Roles have been seeded.');
    } 
    catch (error) {
      console.error('🔍 FULL ERROR:', error);
      console.error('🔍 ERROR STACK:', error.stack);
      console.error('❌Error seeding roles:', error);
    }
  }

  async seedUsers() {
    const userRepository = this.dataSource.getRepository(UserEntity);
    const profileRepository = this.dataSource.getRepository(UserProfileEntity);
    const roleRepository = this.dataSource.getRepository(UserRoleEntity);
    const licenseRepository = this.dataSource.getRepository(DriverLicenseEntity);

    // Получаем роли из базы
    const userRole = await roleRepository.findOne({ where: { name: UserRoles.User } });
    const adminRole = await roleRepository.findOne({ where: { name: UserRoles.Admin } });

    if (!userRole || !adminRole) {
      console.error('❌ Roles not found. Please seed roles first.');
      return;
    }

    const testUsers = [
      {
        email: 'admin@test.com',
        password: await bcrypt.hash('Admin123!', 12),
        firstName: 'Admin',
        lastName: 'User',
        dateOfBirth: new Date('1980-01-01'),
        phone: '+79991112233',
        patronymic: 'Adminovich',
        roleId: adminRole.id,
      },
      {
        email: 'user1@test.com',
        password: await bcrypt.hash('User123!', 12),
        firstName: 'Иван',
        lastName: 'Иванов',
        dateOfBirth: new Date('1990-05-15'),
        phone: '+79992223344',
        patronymic: 'Иванович',
        roleId: userRole.id,
      },
      {
        email: 'user2@test.com',
        password: await bcrypt.hash('User123!', 12),
        firstName: 'Петр',
        lastName: 'Петров',
        dateOfBirth: new Date('1985-08-20'),
        phone: '+79993334455',
        patronymic: 'Петрович',
        roleId: userRole.id,
      },
      {
        email: 'user3@test.com',
        password: await bcrypt.hash('User123!', 12),
        firstName: 'Мария',
        lastName: 'Сидорова',
        dateOfBirth: new Date('1992-03-10'),
        phone: '+79994445566',
        patronymic: 'Ивановна',
        roleId: userRole.id,
      },
      {
        email: 'user4@test.com',
        password: await bcrypt.hash('User123!', 12),
        firstName: 'Алексей',
        lastName: 'Кузнецов',
        dateOfBirth: new Date('1988-11-25'),
        phone: '+79995556677',
        patronymic: 'Сергеевич',
        roleId: userRole.id,
      },
      {
        email: 'user5@test.com',
        password: await bcrypt.hash('User123!', 12),
        firstName: 'Елена',
        lastName: 'Попова',
        dateOfBirth: new Date('1995-07-08'),
        phone: '+79996667788',
        patronymic: 'Александровна',
        roleId: userRole.id,
      },
      {
        email: 'user6@test.com',
        password: await bcrypt.hash('User123!', 12),
        firstName: 'Дмитрий',
        lastName: 'Смирнов',
        dateOfBirth: new Date('1987-12-30'),
        phone: '+79997778899',
        patronymic: 'Владимирович',
        roleId: userRole.id,
      },
      {
        email: 'user7@test.com',
        password: await bcrypt.hash('User123!', 12),
        firstName: 'Ольга',
        lastName: 'Васильева',
        dateOfBirth: new Date('1993-04-18'),
        phone: '+79998889900',
        patronymic: 'Петровна',
        roleId: userRole.id,
      },
      {
        email: 'user8@test.com',
        password: await bcrypt.hash('User123!', 12),
        firstName: 'Сергей',
        lastName: 'Новиков',
        dateOfBirth: new Date('1991-09-05'),
        phone: '+79999990011',
        patronymic: 'Алексеевич',
        roleId: userRole.id,
      },
      {
        email: 'user9@test.com',
        password: await bcrypt.hash('User123!', 12),
        firstName: 'Анна',
        lastName: 'Морозова',
        dateOfBirth: new Date('1994-06-22'),
        phone: '+79991112200',
        patronymic: 'Сергеевна',
        roleId: userRole.id,
      }
    ];
    
    try {
      // Создаем пользователей
      for (let i = 0; i < testUsers.length; i++) {
        const userData = testUsers[i];
        
        // Проверяем, существует ли пользователь
        const existingUser = await userRepository.findOne({ where: { email: userData.email } });
        
        if (!existingUser) {
          // Создаем пользователя
          const user = userRepository.create(userData);
          const savedUser = await userRepository.save(user);
          
          // Создаем профиль
          const profileData = {
            id: this.generateUUID(), // Добавляем явный ID
            userId: savedUser.id,
            city: ['Москва', 'Санкт-Петербург', 'Новосибирск', 'Екатеринбург', 'Казань', 'Нижний Новгород', 'Краснодар', 'Владивосток', 'Сочи', 'Калининград'][i],
            profilePicture: undefined
          };

          const profile = profileRepository.create(profileData);
          await profileRepository.save(profile);

          // Создаем водительские права (для всех кроме админа)
          if (userData.roleId === userRole.id) {
            const licenseData = {
              id: this.generateUUID(), // Добавляем явный ID
              userId: savedUser.id,
              licenseNumber: ['AB123456', 'CD789012', 'EF345678', 'GH901234', 'IJ567890', 'KL123456', 'MN789012', 'OP345678', 'QR901234', 'ST567890'][i],
              issueDate: new Date(2020 + i, i % 12, 15),
              expirationDate: new Date(2030 + i, i % 12, 15)
            };
            
            const license = licenseRepository.create(licenseData);
            await licenseRepository.save(license);
          }

          console.log(`✅ Created user: ${userData.email}`);
        } else {
          console.log(`⚠️ User already exists: ${userData.email}`);
        }
      }

      console.log('✅ Test users have been seeded.');
    } 
    catch (error) {
      console.error('❌ Error seeding test users:', error);
    }
  }

  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}