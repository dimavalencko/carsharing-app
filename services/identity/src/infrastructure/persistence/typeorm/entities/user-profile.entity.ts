import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('user_profiles')
export class UserProfileEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ unique: true })
  userId: string;

  @OneToOne(() => UserEntity, user => user.profile)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @Column({ nullable: true })
  profilePicture: string;

  @Column({ nullable: true })
  city: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}