import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class RegisterUserDto {
  constructor(data: Partial<RegisterUserDto>) {
    Object.assign(this, data)
  }

  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  phone!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;

  @IsString()
  @IsNotEmpty()
  firstName!: string;

  @IsString()
  @IsNotEmpty()
  lastName!: string;
}