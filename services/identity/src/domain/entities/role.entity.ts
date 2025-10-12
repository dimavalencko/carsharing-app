export class UserRole {
  constructor(
    private readonly _id: string,
    private _name: string,
  ) {}

  get id(): string { return this._id; }
  get name(): string { return this._name; }
}