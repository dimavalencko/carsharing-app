import { Entity, PrimaryColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { UserRoles } from '@carsharing/common';
import { UserEntity } from './user.entity';

@Entity('user_roles')
export class UserRoleEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: UserRoles,
    unique: true
  })
  name: UserRoles;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => UserEntity, user => user.role)
  users: UserEntity[];
}