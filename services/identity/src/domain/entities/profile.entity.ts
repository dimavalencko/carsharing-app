import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

// Персональные данные пользователя
@Entity('profile')
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'first_name', length: 50, nullable: true})
  firstName: string;

  @Column({ name: 'last_name', length: 100, nullable: true})
  lastName: string;

  @Column({ name: 'patronymic', length: 100, nullable: true})
  patronymic: string;

  @Column({ name: 'profile_picture', length: 255, nullable: true})
  profilePicture: string;
  
  @CreateDateColumn({ name: 'created_at'})
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at'})
  updatedAt: Date;

  // #region Relations
  
  @OneToOne(() => User, user => user.profile, { onDelete: 'CASCADE'})
  @JoinColumn({ name: 'user_id'})
  user: User;

  // #rendegion

  //  #region Methods

  getFullName(): string {
    return [this.lastName, this.firstName, this.patronymic].filter(Boolean).join('');
  }

  // #endregion
}