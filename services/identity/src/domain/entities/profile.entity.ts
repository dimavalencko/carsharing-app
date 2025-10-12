export class UserProfile {
  constructor(
    private readonly _id: string,
    private readonly _userId: string,
    private _profilePicture: string | null = null,
    private _city: string | null = null,
    private readonly _createdAt: Date = new Date(),
    private _updatedAt: Date = new Date(),
  ) {}

  get id(): string { return this._id; }
  get userId(): string { return this._userId; }
  get profilePicture(): string | null { return this._profilePicture; }
  get city(): string | null { return this._city; }
  get createdAt(): Date { return this._createdAt; }
  get updatedAt(): Date { return this._updatedAt; }

  updateProfile(profilePicture?: string, city?: string, bio?: string): void {
    if (profilePicture !== undefined) this._profilePicture = profilePicture;
    if (city !== undefined) this._city = city;
    this._updatedAt = new Date();
  }
}