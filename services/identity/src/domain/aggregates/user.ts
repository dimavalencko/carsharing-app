import { DriverLicense, User } from '../entities';
import { DomainEvent, DriverLicenseAddedEvent } from '../events';
export class UserAggregate {
  private domainEvents: DomainEvent[] = [];

  private constructor(
    private user: User,
    private driverLicense?: DriverLicense,
  ) {}

  static create(user: User, driverLicense?: DriverLicense): UserAggregate {
    return new UserAggregate(user, driverLicense);
  }

  getUser(): User {
    return this.user;
  }
  getDriverLicense(): DriverLicense | undefined {
    return this.driverLicense;
  }

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
    this.addDomainEvent(
      new DriverLicenseAddedEvent(
        this.user.getId(),
        driverLicense.getId(),
        driverLicense.getLicenseNumber().getValue(),
      ),
    );
  }

  removeDriverLicense(): void {
    this.driverLicense = undefined;
  }

  getFullName(): string {
    const parts = [
      this.user.getLastName(),
      this.user.getFirstName(),
      this.user.getMiddleName(),
    ].filter(Boolean);

    return parts.join(' ');
  }

  getDomainEvents(): DomainEvent[] {
    // Собираем события из всех entities внутри агрегата
    const allEvents = [...this.domainEvents, ...this.user.getDomainEvents()];

    if (this.driverLicense) {
      allEvents.push(...this.driverLicense.getDomainEvents());
    }

    return allEvents;
  }

  clearDomainEvents(): void {
    this.domainEvents = [];
    this.user.clearDomainEvents();
    if (this.driverLicense) {
      this.driverLicense.clearDomainEvents();
    }
  }

  private addDomainEvent(event: DomainEvent): void {
    this.domainEvents.push(event);
  }
}
