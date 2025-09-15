import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm'
import { User } from './user.entity'

// Класс "Водительские права"
@Entity()
export class DriverLicense {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'license_number', unique: true, length: 50})
  licenseNumber: string;

  @Column({ name: 'first_name', length: 50})
  firstName: string;

  @Column({ name: 'last_name', length: 100})
  lastName: string;

  @Column({ name: 'patronymic', length: 100, nullable: true})
  patronymic: string;

  @Column({ name: 'birth_date', type: 'date'})
  birthDate: Date;

  // Получены
  @Column({ name: 'issue_date', type: 'date'})
  issueDate: Date;

  // Истекают
  @Column({ name: 'expiration_date', type: 'date'})
  expirationDate: Date;


  // #region Relations

  @OneToOne(() => User, user => user.driverLicense, { onDelete: 'CASCADE'})
  @JoinColumn({name: 'user_id'})
  user: User;
  
  // #endregion


  // #region Methods

  // Не истекли ли права
  isExpired(): boolean {
    return this.expirationDate < new Date();
  }
  getFullName(): string {
    return [this.lastName, this.firstName, this.patronymic].filter(Boolean).join('');
  }
  
  // #endregion
}