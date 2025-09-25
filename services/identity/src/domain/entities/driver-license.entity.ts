import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('DiverLicense')
export class DriverLicense {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'license_number', type: 'varchar', unique: true, length: 50 })
  licenseNumber: string;

  @Column({ name: 'first_name', type: 'varchar', length: 50 })
  firstName: string;

  @Column({ name: 'last_name', type: 'varchar', length: 100 })
  lastName: string;

  @Column({ name: 'patronymic', type: 'varchar', length: 100, nullable: true })
  patronymic: string | null;

  @Column({ name: 'birth_date', type: 'date' })
  birthDate: Date;

  @Column({ name: 'issue_date', type: 'date' })
  issueDate: Date;

  @Column({ name: 'expiration_date', type: 'date' })
  expirationDate: Date;

  // Relation - для TypeORM
  @OneToOne(() => User, user => user.driverLicense, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

   // Бизнес-логика
   public isExpired(): boolean {
    return this.expirationDate < new Date();
  }

  public getFullName(): string {
    return [this.lastName, this.firstName, this.patronymic].filter(Boolean).join(' ');
  }

  public setUser(user: User): void {
    this.user = user;
  }

  // Валидации
  private validateLicenseNumber(licenseNumber: string): void {
    if (!licenseNumber || licenseNumber.length < 5) {
      throw new Error('License number must be at least 5 characters long');
    }
  }

  private validateName(name: string, fieldName: string): void {
    if (!name || name.length < 2) {
      throw new Error(`${fieldName} must be at least 2 characters long`);
    }
  }

  private validateBirthDate(birthDate: Date): void {
    if (birthDate > new Date()) {
      throw new Error('Birth date cannot be in the future');
    }
  }

  private validateExpirationDate(expirationDate: Date): void {
    if (expirationDate <= new Date()) {
      throw new Error('Expiration date must be in the future');
    }
  }

  // Фабричный метод
  public static create(
    licenseNumber: string,
    firstName: string,
    lastName: string,
    birthDate: Date,
    issueDate: Date,
    expirationDate: Date,
    patronymic: string | null = null
  ): DriverLicense {
    const driverLicense = new DriverLicense();
    driverLicense.licenseNumber = licenseNumber;
    driverLicense.firstName = firstName;
    driverLicense.lastName = lastName;
    driverLicense.birthDate = birthDate;
    driverLicense.issueDate = issueDate;
    driverLicense.expirationDate = expirationDate;
    driverLicense.patronymic = patronymic;
    
    return driverLicense;
  }
}