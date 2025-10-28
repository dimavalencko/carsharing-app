export class UserDto {
  constructor(
    public readonly id: string,
    public readonly login: string,
    public readonly firstName: string,
    public readonly role: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly lastName?: string,
    public readonly middleName?: string,
    public readonly email?: string,
    public readonly phoneNumber?: string,
    public readonly birthDate?: Date,
    public readonly city?: string,
    public readonly avatarUrl?: string,
  ) {}
}