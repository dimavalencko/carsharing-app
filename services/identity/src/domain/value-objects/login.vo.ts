// value-object для валидации логина
export class LoginValue {
  private constructor(private readonly value: string) {
    if (!value || value.length < 3) {
      throw new Error('Login must be at least 3 characters long');
    }
    if (value.length > 50) {
      throw new Error('Login must be less than 50 characters');
    }
  }

  static create(value: string): LoginValue {
    return new LoginValue(value);
  }

  getValue(): string {
    return this.value;
  }

  equals(login: LoginValue): boolean {
    return this.value === login.getValue();
  }
}