import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class DriverLicense {
  @PrimaryGeneratedColumn('uuid')
  private _id: string;

  @Column({ name: 'license_number', type: 'varchar', unique: true, length: 50 })
  private _licenseNumber: string;

  @Column({ name: 'first_name', type: 'varchar', length: 50 })
  private _firstName: string;

  @Column({ name: 'last_name', type: 'varchar', length: 100 })
  private _lastName: string;

  @Column({ name: 'patronymic', type: 'varchar', length: 100, nullable: true })
  private _patronymic: string | null;

  @Column({ name: 'birth_date', type: 'date' })
  private _birthDate: Date;

  @Column({ name: 'issue_date', type: 'date' })
  private _issueDate: Date;

  @Column({ name: 'expiration_date', type: 'date' })
  private _expirationDate: Date;

  // Relation - для TypeORM
  @OneToOne(() => User, user => user.driverLicense, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  public _user: User;

  // Геттеры
  public get id(): string { return this._id; }
  public get licenseNumber(): string { return this._licenseNumber; }
  public get firstName(): string { return this._firstName; }
  public get lastName(): string { return this._lastName; }
  public get patronymic(): string | null { return this._patronymic; }
  public get birthDate(): Date { return this._birthDate; }
  public get issueDate(): Date { return this._issueDate; }
  public get expirationDate(): Date { return this._expirationDate; }
  public get user(): User { return this._user; }

  // Сеттеры с валидацией
  public set licenseNumber(licenseNumber: string) {
    this.validateLicenseNumber(licenseNumber);
    this._licenseNumber = licenseNumber;
  }

  public set firstName(firstName: string) {
    this.validateName(firstName, 'First name');
    this._firstName = firstName;
  }

  public set lastName(lastName: string) {
    this.validateName(lastName, 'Last name');
    this._lastName = lastName;
  }

  public set birthDate(birthDate: Date) {
    this.validateBirthDate(birthDate);
    this._birthDate = birthDate;
  }

  public set expirationDate(expirationDate: Date) {
    this.validateExpirationDate(expirationDate);
    this._expirationDate = expirationDate;
  }
  public set issueDate(issueDate: Date) {
    this.validateExpirationDate(issueDate);
    this._issueDate = issueDate;
  }

  // Бизнес-логика
  public isExpired(): boolean {
    return this._expirationDate < new Date();
  }

  public getFullName(): string {
    return [this._lastName, this._firstName, this._patronymic].filter(Boolean).join(' ');
  }

  public setUser(user: User): void {
    this._user = user;
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
    driverLicense._patronymic = patronymic;
    
    return driverLicense;
  }
}