import { DataSource } from 'typeorm';
import { Role } from '@domain/entities';
import { UserRoles } from '@domain/enums/user-roles';

export async function seedRoles(dataSource: DataSource) {
  const roleRepository = dataSource.getRepository(Role);

  // Получаем все роли из enum
  const rolesToSeed = Object.values(UserRoles).map(roleName => {
    const role = new Role();
    role.name = roleName;
    return role;
  });

  try {
    await roleRepository
      .createQueryBuilder()
      .insert()
      .into(Role)
      .values(rolesToSeed)
      .orIgnore()
      .execute();

    console.log('✅Roles have been seeded.');
  } 
  catch (error) {
    console.error('❌Error seeding roles:', error);
  }
}