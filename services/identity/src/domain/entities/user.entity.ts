import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Profile } from './profile.entity';
import { DriverLicense } from './driver-license.entity';
import { RefreshToken } from './refresh-token.entity';
import { Role } from './role.entity';

@Entity('Users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 255 })
  email: string;

  @Column({ name: 'phone_number', type: 'varchar', unique: true, length: 20 })
  phone: string;
  
  @Column({ name: 'password_hash', type: 'varchar', length: 255 })
  passwordHash: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations - для TypeORM делаем protected
  @OneToOne(() => Profile, profile => profile.user, { cascade: true, eager: true })
  profile: Profile;

  @OneToOne(() => DriverLicense, driverLicense => driverLicense.user, { cascade: true, eager: true })
  driverLicense: DriverLicense;

  @OneToMany(() => RefreshToken, refreshToken => refreshToken.user)
  refreshTokens: RefreshToken[];

  @ManyToOne(() => Role, role => role.users)
  @JoinColumn({ name: 'role_id' })
  role: Role;

  // Бизнес-методы
  public async setPassword(password: string): Promise<void> {
    this.validatePasswordStrength(password);
    this.passwordHash = await this.hashPassword(password);
  }

  public async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.passwordHash);
  }

  public setProfile(profile: Profile): void {
    this.profile = profile;
  }

  public setDriverLicense(driverLicense: DriverLicense): void {
    this.driverLicense = driverLicense;
  }

  public setRole(role: Role): void {
    this.role = role;
  }

  public addRefreshToken(refreshToken: RefreshToken): void {
    if (!this.refreshTokens) {
      this.refreshTokens = [];
    }
    this.refreshTokens.push(refreshToken);
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
    user.profile = profile;
    user.role = role;
    
    await user.setPassword(password);
    
    return user;
  }
}