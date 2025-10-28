import { PhoneNumberValue, LoginValue, PasswordValue, EmailValue } from "../value-objects";
import { UserRoles } from "@carsharing/common";

export interface UserProps {
  login: LoginValue;
  password: PasswordValue;
  firstName: string;
  lastName?: string;
  middleName?: string;
  email?: EmailValue;
  phoneNumber?: PhoneNumberValue;
  birthDate?: Date;
  city?: string;
  avatarUrl?: string;
  role: UserRoles;
  createdAt: Date;
  updatedAt: Date;
}

export class User {
  private constructor(
    private readonly id: string,
    private props: UserProps
  ) {}

  static create(props: Omit<UserProps, 'createdAt' | 'updatedAt' | 'role'>, id?: string): User {
    const now = new Date();
    return new User(id || this.generateId(), {
      ...props,
      role: UserRoles.User,
      createdAt: now,
      updatedAt: now
    });
  }

  static createAdmin(props: Omit<UserProps, 'createdAt' | 'updatedAt' | 'role'>, id?: string): User {
    const now = new Date();
    return new User(id || this.generateId(), {
      ...props,
      role: UserRoles.Admin,
      createdAt: now,
      updatedAt: now
    });
  }

  private static generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  getId(): string { return this.id; }
  getLogin(): LoginValue { return this.props.login; }
  getPassword(): PasswordValue { return this.props.password; }
  getFirstName(): string { return this.props.firstName; }
  getLastName(): string | undefined { return this.props.lastName; }
  getMiddleName(): string | undefined { return this.props.middleName; }
  getEmail(): EmailValue | undefined { return this.props.email; }
  getPhoneNumber(): PhoneNumberValue | undefined { return this.props.phoneNumber; }
  getBirthDate(): Date | undefined { return this.props.birthDate; }
  getCity(): string | undefined { return this.props.city; }
  getAvatarUrl(): string | undefined { return this.props.avatarUrl; }
  getRole(): UserRoles { return this.props.role; }
  getCreatedAt(): Date { return this.props.createdAt; }
  getUpdatedAt(): Date { return this.props.updatedAt; }


  updateProfile(profileData: Partial<Pick<UserProps, 
    'lastName' | 'middleName' | 'email' | 'phoneNumber' | 'birthDate' | 'city' | 'avatarUrl'
  >>): void {
    this.props = {
      ...this.props,
      ...profileData,
      updatedAt: new Date()
    };
  }

  changePassword(newPassword: PasswordValue): void {
    this.props.password = newPassword;
    this.props.updatedAt = new Date();
  }

  isAdministrator(): boolean {
    return this.props.role === UserRoles.Admin;
  }
}