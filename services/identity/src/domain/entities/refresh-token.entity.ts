import { DomainEvent, RefreshTokenRevokedEvent } from '../events';

export interface RefreshTokenProps {
  userId: string;
  token: string;
  expiresAt: Date;
  createdAt: Date;
  revokedAt?: Date;
}

export class RefreshToken {
  private domainEvents: DomainEvent[] = [];

  private constructor(
    private readonly id: string,
    private props: RefreshTokenProps,
  ) {}

  static create(
    props: Omit<RefreshTokenProps, 'createdAt'>,
    id: string,
  ): RefreshToken {
    return new RefreshToken(id, {
      ...props,
      createdAt: new Date(),
    });
  }

  static reconstitute(id: string, props: RefreshTokenProps): RefreshToken {
    return new RefreshToken(id, props);
  }

  getId(): string {
    return this.id;
  }
  getUserId(): string {
    return this.props.userId;
  }
  getToken(): string {
    return this.props.token;
  }
  getExpiresAt(): Date {
    return this.props.expiresAt;
  }
  getCreatedAt(): Date {
    return this.props.createdAt;
  }
  getRevokedAt(): Date | undefined {
    return this.props.revokedAt;
  }

  revoke(): void {
    if (this.props.revokedAt) {
      return;
    }
    this.props.revokedAt = new Date();
    this.addDomainEvent(
      new RefreshTokenRevokedEvent(this.id, this.props.userId),
    );
  }

  isRevoked(): boolean {
    return !!this.props.revokedAt;
  }

  isExpired(): boolean {
    return this.props.expiresAt < new Date();
  }

  isValid(): boolean {
    return !this.isRevoked() && !this.isExpired();
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
