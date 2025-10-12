export class DriverLicense {
  constructor(
    private readonly _id: string,
    private readonly _userId: string,
    private _licenseNumber: string,
    private _issueDate: Date,
    private _expirationDate: Date,
    private readonly _createdAt: Date = new Date(),
    private _updatedAt: Date = new Date(),
  ) {}

  get id(): string { return this._id; }
  get userId(): string { return this._userId; }
  get licenseNumber(): string { return this._licenseNumber; }
  get issueDate(): Date { return this._issueDate; }
  get expirationDate(): Date { return this._expirationDate; }
  get createdAt(): Date { return this._createdAt; }
  get updatedAt(): Date { return this._updatedAt; }

  updateLicenseInfo(licenseNumber: string, issueDate: Date, expirationDate: Date): void {
    this._licenseNumber = licenseNumber;
    this._issueDate = issueDate;
    this._expirationDate = expirationDate;
    this._updatedAt = new Date();
  }

  isExpired(): boolean {
    return new Date() > this._expirationDate;
  }
}