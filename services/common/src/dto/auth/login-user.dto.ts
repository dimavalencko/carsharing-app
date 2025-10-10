import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginUserDto {
  constructor(data: Partial<LoginUserDto>) {
    Object.assign(this, data)
  }

  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;
}