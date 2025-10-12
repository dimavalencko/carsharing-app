import { Email } from "../value-objects/email.vo";
import { PasswordHash } from "../value-objects/password-hash.vo";

export class User {
  constructor(
    private readonly _id: string,
    private _email: Email,
    private _passwordHash: PasswordHash,
    private _firstName: string,
    private _lastName: string,
    private _dateOfBirth: Date,
    private _roleId: string,
    private _phone: string | null = null,
    private _patronymic: string | null = null,
    private _lastLoginAt: Date | null = null,
    private readonly _createdAt: Date = new Date(),
    private _updatedAt: Date = new Date(),
  ) {}

  get id(): string { return this._id; }
  get email(): Email { return this._email; }
  get passwordHash(): PasswordHash { return this._passwordHash; }
  get firstName(): string { return this._firstName; }
  get lastName(): string { return this._lastName; }
  get dateOfBirth(): Date { return this._dateOfBirth; }
  get roleId(): string { return this._roleId; }
  get phone(): string | null { return this._phone; }
  get patronymic(): string | null { return this._patronymic; }
  get lastLoginAt(): Date | null { return this._lastLoginAt; }
  get createdAt(): Date { return this._createdAt; }
  get updatedAt(): Date { return this._updatedAt; }

  set phone(value: string | null) {
    this._phone = value;
    this._updatedAt = new Date();
  }
  set patronymic(value: string | null) {
    this._patronymic = value;
    this._updatedAt = new Date();
  }

  // Business methods
  updatePersonalInfo(firstName: string, lastName: string, dateOfBirth: Date): void {
    this._firstName = firstName;
    this._lastName = lastName;
    this._dateOfBirth = dateOfBirth;
    this._updatedAt = new Date();
  }

  changeEmail(email: Email): void {
    this._email = email;
    this._updatedAt = new Date();
  }

  changePassword(passwordHash: PasswordHash): void {
    this._passwordHash = passwordHash;
    this._updatedAt = new Date();
  }

  markAsLoggedIn(): void {
    this._lastLoginAt = new Date();
  }
}