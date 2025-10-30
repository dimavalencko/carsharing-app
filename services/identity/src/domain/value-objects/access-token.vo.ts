// value-object для валидации access-токена
export class AccessTokenValue {
  private constructor(private readonly value: string) {
    if (!value) {
      throw new Error('Access token cannot be empty');
    }
  }

  static create(value: string): AccessTokenValue {
    return new AccessTokenValue(value);
  }

  getValue(): string {
    return this.value;
  }
}
