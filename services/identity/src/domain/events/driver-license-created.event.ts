import { DomainEvent } from './base-event';

export class DriverLicenseCreatedEvent extends DomainEvent {
  constructor(
    public readonly licenseId: string,
    public readonly userId: string,
    public readonly licenseNumber: string
  ) {
    super();
  }

  getEventName(): string {
    return 'driver-license.created';
  }
}
