import { Entity, Column, PrimaryColumn, OneToOne, JoinColumn } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('driver_licenses')
export class DriverLicenseEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column('uuid')
  userId: string;

  @Column({ length: 50 })
  licenseNumber: string;

  @Column({ type: 'date' })
  issueDate: Date;

  @Column({ type: 'date' })
  expirationDate: Date;

  @Column({ type: 'varchar', length: 100 })
  issuingAuthority: string;

  @Column({ type: 'simple-array' })
  categories: string[];

  @OneToOne(() => UserEntity, user => user.driverLicense)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;
}