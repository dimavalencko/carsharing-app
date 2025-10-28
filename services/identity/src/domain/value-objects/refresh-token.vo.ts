// value-object для валидации refresh-токена 
export class RefreshTokenValue {
  constructor(private readonly value: string) {
    if (!value) {
      throw new Error('Refresh token cannot be empty');
    }
  }

  getValue(): string {
    return this.value;
  }
}