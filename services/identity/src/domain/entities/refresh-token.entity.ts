import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('refresh_tokens')
export class RefreshToken {
  @PrimaryGeneratedColumn()
  private _id: number;

  @Column({ name: 'token_hash', type: 'varchar', length: 255 })
  private _tokenHash: string;

  @Column({ name: 'expires_at' })
  private _expiresAt: Date;

  @Column({ default: false })
  private _revoked: boolean;

  @Column({ name: 'user_agent', type: 'varchar', length: 500, nullable: true })
  private _userAgent: string | null = null;

  @Column({ name: 'ip_address', type: 'varchar', length: 45, nullable: true })
  private _ipAddress: string | null = null;

  @CreateDateColumn({ name: 'created_at' })
  private _createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  private _updatedAt: Date;

  // Relation - для TypeORM
  @ManyToOne(() => User, user => user.refreshTokens, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  public _user: User;

  // Геттеры
  public get id(): number { return this._id; }
  public get tokenHash(): string { return this._tokenHash; }
  public get expiresAt(): Date { return this._expiresAt; }
  public get revoked(): boolean { return this._revoked; }
  public get userAgent(): string| null { return this._userAgent; }
  public get ipAddress(): string | null { return this._ipAddress; }
  public get createdAt(): Date { return this._createdAt; }
  public get updatedAt(): Date { return this._updatedAt; }
  public get user(): User { return this._user; }

  // Бизнес-логика
  public revoke(): void {
    this._revoked = true;
  }

  public isExpired(): boolean {
    return this._expiresAt < new Date();
  }

  public isValid(): boolean {
    return !this._revoked && !this.isExpired();
  }

  public setUser(user: User): void {
    this._user = user;
  }

  // Фабричный метод
  public static create(
    tokenHash: string,
    expiresAt: Date,
    user: User,
    userAgent?: string,
    ipAddress?: string
  ): RefreshToken {
    const refreshToken = new RefreshToken();
    refreshToken._tokenHash = tokenHash;
    refreshToken._expiresAt = expiresAt;
    refreshToken._user = user;
    refreshToken._userAgent = userAgent || null;
    refreshToken._ipAddress = ipAddress || null;
    
    return refreshToken;
  }
}