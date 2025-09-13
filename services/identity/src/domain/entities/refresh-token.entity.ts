import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, JoinColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';

// Персональные данные пользователя
@Entity('refresh_tokens')
export class RefreshToken {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({name: 'token_hash', length: 255})
  tokenHash: string;

  @Column({name: 'expires_at'})
  expiresAt: Date;

  @Column({default: false})
  revoked: boolean;

  @Column({name: 'user_agent', length: 500, nullable: true})
  userAgent: string;

  @Column({name: 'ip_address', length: 45, nullable: true})
  ipAddress: string;

  @CreateDateColumn({ name: 'created_at'})
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at'})
  updatedAt: Date;


  // #region Relations

  @ManyToOne(() => User, user => user.refreshTokens, { onDelete: 'CASCADE'})
  @JoinColumn({name: 'user_id'})
  user: User;

  // #endregion
}