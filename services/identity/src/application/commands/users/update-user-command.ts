export class UpdateUserProfileCommand {
  constructor(
    public readonly userId: string,
    public readonly lastName?: string,
    public readonly middleName?: string,
    public readonly email?: string,
    public readonly phoneNumber?: string,
    public readonly birthDate?: Date,
    public readonly city?: string,
    public readonly avatarUrl?: string,
  ) {}
}