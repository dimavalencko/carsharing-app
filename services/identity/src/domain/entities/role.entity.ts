import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { UserRoles } from '../enums/user-roles';

@Entity('Roles')
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, type: 'enum', enum: UserRoles, default: UserRoles.USER })
 name: UserRoles;

  // Relation - для TypeORM
  @OneToMany(() => User, user => user.role)
  users: User[];
}