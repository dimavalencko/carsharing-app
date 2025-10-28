import { DomainEvent } from './base-event';

export class RefreshTokenRevokedEvent extends DomainEvent {
  constructor(
    public readonly tokenId: string,
    public readonly userId: string
  ) {
    super();
  }

  getEventName(): string {
    return 'refresh-token.revoked';
  }
}
