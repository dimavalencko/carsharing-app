import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { UserRoles } from '../enums/user-roles';

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn()
  private _id: number;

  @Column({ unique: true, type: 'enum', enum: UserRoles, default: UserRoles.USER })
  private _name: UserRoles;

  // Relation - для TypeORM
  @OneToMany(() => User, user => user.role)
  protected _users: User[];

  // Геттеры
  public get id(): number { return this._id; }
  public get name(): UserRoles { return this._name; }
  public get users(): User[] { return this._users; }

  // Сеттер с валидацией
  public set name(name: UserRoles) {
    if (!Object.values(UserRoles).includes(name)) {
      throw new Error('Invalid role');
    }
    this._name = name;
  }
}