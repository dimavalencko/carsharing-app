export class CreateAdminUserCommand {
  constructor(
    public readonly login: string,
    public readonly password: string,
    public readonly firstName: string,
    public readonly lastName?: string,
    public readonly middleName?: string,
    public readonly email?: string,
    public readonly phoneNumber?: string,
    public readonly birthDate?: Date,
    public readonly city?: string,
    public readonly avatarUrl?: string,
  ) {}
}