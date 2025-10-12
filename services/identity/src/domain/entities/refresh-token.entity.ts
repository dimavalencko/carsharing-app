import { PasswordHash } from "../value-objects/password-hash.vo";

export class RefreshToken {
  constructor(
    private readonly _id: string,
    private readonly _userId: string,
    private _tokenHash: PasswordHash,
    private _expiresAt: Date,
    private _userAgent: string | null = null,
    private _ipAddress: string | null = null,
    private _isRevoked: boolean = false,
    private readonly _createdAt: Date = new Date(),
  ) {}

  get id(): string { return this._id; }
  get userId(): string { return this._userId; }
  get tokenHash(): PasswordHash { return this._tokenHash; }
  get expiresAt(): Date { return this._expiresAt; }
  get userAgent(): string | null { return this._userAgent; }
  get ipAddress(): string | null { return this._ipAddress; }
  get isRevoked(): boolean { return this._isRevoked; }
  get createdAt(): Date { return this._createdAt; }

  revoke(): void {
    this._isRevoked = true;
  }

  isValid(): boolean {
    return !this._isRevoked && new Date() < this._expiresAt;
  }
}