import { DomainEvent } from './base-event';

export class DriverLicenseAddedEvent extends DomainEvent {
  constructor(
    public readonly userId: string,
    public readonly licenseId: string,
    public readonly licenseNumber: string,
  ) {
    super();
  }

  getEventName(): string {
    return 'driver-license.added';
  }
}
