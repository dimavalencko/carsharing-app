import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { UserRole } from '@carsharing/common';

@Entity('Roles')
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, type: 'enum', enum: UserRole, default: UserRole.UnauthorizedUser })
  name: UserRole;

  // Relation - для TypeORM
  @OneToMany(() => User, user => user.role)
  users: User[];
}