import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('Profile')
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'first_name', type: 'varchar', length: 50, nullable: true })
  firstName: string | null = null;

  @Column({ name: 'last_name', type: 'varchar', length: 100, nullable: true })
  lastName: string | null = null;

  @Column({ name: 'patronymic', type: 'varchar', length: 100, nullable: true })
  patronymic: string | null = null;

  @Column({ name: 'profile_picture', type: 'varchar', length: 255, nullable: true })
  profilePicture: string | null = null;
  
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relation - для TypeORM
  @OneToOne(() => User, user => user.profile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

   // Бизнес-логика
   public getFullName(): string {
    return [this.lastName, this.firstName, this.patronymic]
      .filter(Boolean)
      .join(' ');
  }

  // Валидации
  private validateName(name: string, fieldName: string): void {
    if (name.length < 2) {
      throw new Error(`${fieldName} must be at least 2 characters long`);
    }
  }

  private validateProfilePicture(profilePicture: string): void {
    if (!profilePicture.startsWith('http')) {
      throw new Error('Profile picture must be a valid URL');
    }
  }

  // Фабричный метод
  public static create(
    firstName: string,
    lastName: string,
    patronymic?: string| null,
    profilePicture?: string | null
  ): Profile {
    const profile = new Profile();
    profile.firstName = firstName;
    profile.lastName = lastName;
    profile.patronymic = patronymic || null;
    profile.profilePicture = profilePicture || null;
    
    return profile;
  }
}