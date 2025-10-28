import { DomainEvent } from './base-event';

export class UserPasswordChangedEvent extends DomainEvent {
  constructor(
    public readonly userId: string,
    public readonly login: string
  ) {
    super();
  }

  getEventName(): string {
    return 'user.password.changed';
  }
}
