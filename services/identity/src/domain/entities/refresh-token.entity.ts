import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('RefreshTokens')
export class RefreshToken {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'token_hash', type: 'varchar', length: 255 })
  tokenHash: string;

  @Column({ name: 'expires_at' })
  expiresAt: Date;

  @Column({ default: false })
 revoked: boolean;

  @Column({ name: 'user_agent', type: 'varchar', length: 500, nullable: true })
  userAgent: string | null = null;

  @Column({ name: 'ip_address', type: 'varchar', length: 45, nullable: true })
  ipAddress: string | null = null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relation - для TypeORM
  @ManyToOne(() => User, user => user.refreshTokens, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  // Бизнес-логика
  public revoke(): void {
    this.revoked = true;
  }

  public isExpired(): boolean {
    return this.expiresAt < new Date();
  }

  public isValid(): boolean {
    return !this.revoked && !this.isExpired();
  }

  public setUser(user: User): void {
    this.user = user;
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
    refreshToken.tokenHash = tokenHash;
    refreshToken.expiresAt = expiresAt;
    refreshToken.user = user;
    refreshToken.userAgent = userAgent || null;
    refreshToken.ipAddress = ipAddress || null;
    
    return refreshToken;
  }
}