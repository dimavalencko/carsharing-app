import { DriverLicense, User } from "../entities";

export class UserAggregate {
  private constructor(
    private user: User,
    private driverLicense?: DriverLicense
  ) {}

  static create(user: User, driverLicense?: DriverLicense): UserAggregate {
    return new UserAggregate(user, driverLicense);
  }

  getUser(): User { return this.user; }
  getDriverLicense(): DriverLicense | undefined { return this.driverLicense; }

  hasDriverLicense(): boolean {
    return !!this.driverLicense;
  }
  
  addDriverLicense(driverLicense: DriverLicense): void {
    if (driverLicense.getUserId() !== this.user.getId()) {
      throw new Error('Driver license does not belong to this user');
    }
    if (this.driverLicense) {
      throw new Error('User already has driver license');
    }

    this.driverLicense = driverLicense;
  }

  removeDriverLicense(): void {
    this.driverLicense = undefined;
  }


  getFullName(): string {
    const parts = [
      this.user.getLastName(),
      this.user.getFirstName(),
      this.user.getMiddleName()
    ].filter(Boolean);
    
    return parts.join(' ');
  }
}