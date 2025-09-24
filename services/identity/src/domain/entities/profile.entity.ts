import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('profile')
export class Profile {
  @PrimaryGeneratedColumn()
  private _id: number;

  @Column({ name: 'first_name', type: 'varchar', length: 50, nullable: true })
  private _firstName: string | null = null;

  @Column({ name: 'last_name', type: 'varchar', length: 100, nullable: true })
  private _lastName: string | null = null;

  @Column({ name: 'patronymic', type: 'varchar', length: 100, nullable: true })
  private _patronymic: string | null = null;

  @Column({ name: 'profile_picture', type: 'varchar', length: 255, nullable: true })
  private _profilePicture: string | null = null;
  
  @CreateDateColumn({ name: 'created_at' })
  private _createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  private _updatedAt: Date;

  // Relation - для TypeORM
  @OneToOne(() => User, user => user.profile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  public _user: User;

  // Геттеры
  public get id(): number { return this._id; }
  public get firstName(): string | null { return this._firstName; }
  public get lastName(): string | null { return this._lastName; }
  public get patronymic(): string | null { return this._patronymic; }
  public get profilePicture(): string | null { return this._profilePicture; }
  public get createdAt(): Date { return this._createdAt; }
  public get updatedAt(): Date { return this._updatedAt; }
  public get user(): User { return this._user; }

  // Сеттеры с валидацией
  public set firstName(firstName: string | null) {
    if (firstName) this.validateName(firstName, 'First name');
    this._firstName = firstName;
  }

  public set lastName(lastName: string | null) {
    if (lastName) this.validateName(lastName, 'Last name');
    this._lastName = lastName;
  }

  public set patronymic(patronymic: string | null) {
    if (patronymic) this.validateName(patronymic, 'Patronymic');
    this._patronymic = patronymic;
  }

  public set profilePicture(profilePicture: string | null) {
    if (profilePicture) this.validateProfilePicture(profilePicture);
    this._profilePicture = profilePicture;
  }

  public setUser(user: User): void {
    this._user = user;
  }

  // Бизнес-логика
  public getFullName(): string {
    return [this._lastName, this._firstName, this._patronymic]
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