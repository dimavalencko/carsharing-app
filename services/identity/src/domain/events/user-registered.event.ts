import { DomainEvent } from './base-event';

export class UserRegisteredEvent extends DomainEvent {
  constructor(
    public readonly userId: string,
    public readonly login: string,
    public readonly firstName: string,
    public readonly lastName?: string,
  ) {
    super();
  }

  getEventName(): string {
    return 'user.registered';
  }
}
