import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { UserRoles } from '../enums/user-roles';

// Персональные данные пользователя
@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({unique: true, type: 'enum', enum: UserRoles, default: UserRoles.USER})
  name: UserRoles;
  
  // #region Relations

  @OneToMany(() => User, user => user.role)
  users: User[];

  // #endregion  
}