export interface RefreshTokenProps {
  userId: string;
  token: string;
  expiresAt: Date;
  createdAt: Date;
  revokedAt?: Date;
}

export class RefreshToken {
  private constructor(
    private readonly id: string,
    private props: RefreshTokenProps
  ) {}

  static create(props: Omit<RefreshTokenProps, 'createdAt'>, id?: string): RefreshToken {
    return new RefreshToken(id || this.generateId(), {
      ...props,
      createdAt: new Date()
    });
  }

  private static generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  getId(): string { return this.id; }
  getUserId(): string { return this.props.userId; }
  getToken(): string { return this.props.token; }
  getExpiresAt(): Date { return this.props.expiresAt; }
  getCreatedAt(): Date { return this.props.createdAt; }
  getRevokedAt(): Date | undefined { return this.props.revokedAt; }

  revoke(): void {
    this.props.revokedAt = new Date();
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
}