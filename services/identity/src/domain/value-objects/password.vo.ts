export class PasswordValue {
  private constructor(private readonly value: string) {
    if (!value || value.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }
  }

  static create(value: string): PasswordValue {
    return new PasswordValue(value);
  }

  getValue(): string {
    return this.value;
  }
}
