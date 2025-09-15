import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, OneToMany, JoinTable, ManyToOne, JoinColumn } from 'typeorm';
import { Profile, DriverLicense, Role, RefreshToken } from './index';
import { UserRoles } from '@domain/enums/user-roles';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 255 })
  email: string;

  @Column({ name: 'phone_number', unique: true, length: 20})
  phone: string;
  
  @Column({name: 'password_hash', length: 255})
  password_hash: string;

  @CreateDateColumn({ name: 'created_at'})
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at'})
  updatedAt: Date;


  // #region Relations

  @OneToOne(() => Profile, profile => profile.user, { cascade: true, eager: true})
  profile: Profile;

  @OneToOne(() => DriverLicense, driverLicense => driverLicense.user, { cascade: true, eager: true})
  driverLicense: DriverLicense;

  @OneToMany(() => RefreshToken, refreshToken => refreshToken.user)
  refreshTokens: RefreshToken[];

  
  @ManyToOne(() => Role, role => role.users)
  @JoinColumn({name: 'role_id'})
  role: Role;

  // #endregion


  // #region Methods

  hasRole(roleName: UserRoles): boolean {
    return this.role.name == roleName
  }
  
  isAdministrator(): boolean {
    return this.role.name === UserRoles.ADMINISTRATOR;
  }

  isManager(): boolean {
    return this.role.name === UserRoles.MANAGER;
  }

  // #endregion
}