// value-object для валидации refresh-токена
export class RefreshTokenValue {
  private constructor(private readonly value: string) {
    if (!value) {
      throw new Error('Refresh token cannot be empty');
    }
  }

  static create(value: string): RefreshTokenValue {
    return new RefreshTokenValue(value);
  }

  getValue(): string {
    return this.value;
  }
}
