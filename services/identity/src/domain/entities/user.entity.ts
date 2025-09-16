import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Profile } from './profile.entity';
import { DriverLicense } from './driver-license.entity';
import { RefreshToken } from './refresh-token.entity';
import { Role } from './role.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  private _id: string;

  @Column({ unique: true, length: 255 })
  private _email: string;

  @Column({ name: 'phone_number', type: 'varchar', unique: true, length: 20 })
  private _phone: string;
  
  @Column({ name: 'password_hash', type: 'varchar', length: 255 })
  private _passwordHash: string;

  @CreateDateColumn({ name: 'created_at' })
  private _createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  private _updatedAt: Date;

  // Relations - для TypeORM делаем protected
  @OneToOne(() => Profile, profile => profile.user, { cascade: true, eager: true })
  protected _profile: Profile;

  @OneToOne(() => DriverLicense, driverLicense => driverLicense.user, { cascade: true, eager: true })
  protected _driverLicense: DriverLicense;

  @OneToMany(() => RefreshToken, refreshToken => refreshToken.user)
  protected _refreshTokens: RefreshToken[];

  @ManyToOne(() => Role, role => role.users)
  @JoinColumn({ name: 'role_id' })
  protected _role: Role;

  // Геттеры
  public get id(): string { return this._id; }
  public get email(): string { return this._email; }
  public get phone(): string { return this._phone; }
  public get passwordHash(): string { return this._passwordHash; }
  public get createdAt(): Date { return this._createdAt; }
  public get updatedAt(): Date { return this._updatedAt; }
  public get profile(): Profile { return this._profile; }
  public get driverLicense(): DriverLicense { return this._driverLicense; }
  public get refreshTokens(): RefreshToken[] { return this._refreshTokens; }
  public get role(): Role { return this._role; }

  // Сеттеры с валидацией
  public set email(email: string) { 
    this.validateEmail(email);
    this._email = email; 
  }

  public set phone(phone: string) { 
    this.validatePhone(phone);
    this._phone = phone; 
  }

  // Бизнес-методы
  public async setPassword(password: string): Promise<void> {
    this.validatePasswordStrength(password);
    this._passwordHash = await this.hashPassword(password);
  }

  public async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this._passwordHash);
  }

  public setProfile(profile: Profile): void {
    this._profile = profile;
  }

  public setDriverLicense(driverLicense: DriverLicense): void {
    this._driverLicense = driverLicense;
  }

  public setRole(role: Role): void {
    this._role = role;
  }

  public addRefreshToken(refreshToken: RefreshToken): void {
    if (!this._refreshTokens) {
      this._refreshTokens = [];
    }
    this._refreshTokens.push(refreshToken);
  }

  public revokeRefreshToken(tokenHash: string): void {
    const token = this.refreshTokens.find(t => t.tokenHash === tokenHash);
    if (token) {
      token.revoke();
    }
  }

  public revokeAllRefreshTokens(): void {
    this.refreshTokens.forEach(token => token.revoke());
  }

  // Валидации
  private validateEmail(email: string): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format');
    }
  }

  private validatePhone(phone: string): void {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (!phoneRegex.test(phone)) {
      throw new Error('Invalid phone number format');
    }
  }

  private validatePasswordStrength(password: string): void {
    if (password.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }
    
    if (!/[A-Z]/.test(password)) {
      throw new Error('Password must contain at least one uppercase letter');
    }
    
    if (!/[0-9]/.test(password)) {
      throw new Error('Password must contain at least one number');
    }
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return bcrypt.hash(password, saltRounds);
  }

  // Фабричный метод
  public static async create(
    email: string,
    phone: string,
    password: string,
    profile: Profile,
    role: Role
  ): Promise<User> {
    const user = new User();
    user.email = email;
    user.phone = phone;
    user._profile = profile;
    user._role = role;
    
    await user.setPassword(password);
    
    return user;
  }
}