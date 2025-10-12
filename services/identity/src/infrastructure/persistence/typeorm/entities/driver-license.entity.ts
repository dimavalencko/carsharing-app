import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('driver_licenses')
export class DriverLicenseEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ unique: true })
  userId: string;

  @OneToOne(() => UserEntity, user => user.driverLicense)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @Column()
  licenseNumber: string;

  @Column()
  issueDate: Date;

  @Column()
  expirationDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}