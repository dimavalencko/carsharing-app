import { DriverLicenseNumberValue } from '../value-objects';
import { DomainEvent, DriverLicenseCreatedEvent } from '../events';

export interface DriverLicenseProps {
  userId: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  birthDate: Date;
  birthPlace: string;
  issueDate: Date;
  expiryDate: Date;
  issuedBy: string;
  licenseNumber: DriverLicenseNumberValue;
  createdAt: Date;
  updatedAt: Date;
}

export class DriverLicense {
  private domainEvents: DomainEvent[] = [];

  private constructor(
    private readonly id: string,
    private props: DriverLicenseProps,
  ) {}

  static create(
    props: Omit<DriverLicenseProps, 'createdAt' | 'updatedAt'>,
    id: string,
  ): DriverLicense {
    const now = new Date();

    if (props.issueDate >= props.expiryDate) {
      throw new Error('Issue date must be before expiry date');
    }

    if (props.expiryDate <= new Date()) {
      throw new Error('Driver license has expired');
    }

    const driverLicense = new DriverLicense(id, {
      ...props,
      createdAt: now,
      updatedAt: now,
    });

    driverLicense.addDomainEvent(
      new DriverLicenseCreatedEvent(
        id,
        props.userId,
        props.licenseNumber.getValue(),
      ),
    );

    return driverLicense;
  }

  static reconstitute(id: string, props: DriverLicenseProps): DriverLicense {
    return new DriverLicense(id, props);
  }

  getId(): string {
    return this.id;
  }
  getUserId(): string {
    return this.props.userId;
  }
  getFirstName(): string {
    return this.props.firstName;
  }
  getLastName(): string {
    return this.props.lastName;
  }
  getMiddleName(): string | undefined {
    return this.props.middleName;
  }
  getBirthDate(): Date {
    return this.props.birthDate;
  }
  getBirthPlace(): string {
    return this.props.birthPlace;
  }
  getIssueDate(): Date {
    return this.props.issueDate;
  }
  getExpiryDate(): Date {
    return this.props.expiryDate;
  }
  getIssuedBy(): string {
    return this.props.issuedBy;
  }
  getLicenseNumber(): DriverLicenseNumberValue {
    return this.props.licenseNumber;
  }
  getCreatedAt(): Date {
    return this.props.createdAt;
  }
  getUpdatedAt(): Date {
    return this.props.updatedAt;
  }

  updateInfo(
    updateData: Partial<
      Pick<
        DriverLicenseProps,
        'firstName' | 'lastName' | 'middleName' | 'birthPlace' | 'issuedBy'
      >
    >,
  ): void {
    this.props = {
      ...this.props,
      ...updateData,
      updatedAt: new Date(),
    };
  }

  isExpired(): boolean {
    return this.props.expiryDate <= new Date();
  }

  getDomainEvents(): DomainEvent[] {
    return [...this.domainEvents];
  }

  clearDomainEvents(): void {
    this.domainEvents = [];
  }

  private addDomainEvent(event: DomainEvent): void {
    this.domainEvents.push(event);
  }
}
