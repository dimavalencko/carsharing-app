import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, ManyToOne, OneToMany } from 'typeorm';
import { UserRoleEntity } from './user-role.entity';
import { UserProfileEntity } from './user-profile.entity';
import { DriverLicenseEntity } from './driver-license.entity';
import { RefreshTokenEntity } from './refresh-token.entity';

@Entity('users')
export class UserEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  patronymic: string | null;

  @Column()
  dateOfBirth: Date;

  @Column({ nullable: true })
  phone: string | null;

  @Column()
  roleId: string;

  @ManyToOne(() => UserRoleEntity, role => role.users)
  role: UserRoleEntity;

  @Column({ type: 'timestamp', nullable: true })
  lastLoginAt: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => UserProfileEntity, profile => profile.user)
  profile: UserProfileEntity;

  @OneToOne(() => DriverLicenseEntity, license => license.user)
  driverLicense: DriverLicenseEntity;

  @OneToMany(() => RefreshTokenEntity, token => token.user)
  refreshTokens: RefreshTokenEntity[];
}