// value-object для валидации access-токена 
export class AccessTokenValue {
  constructor(private readonly value: string) {
    if (!value) {
      throw new Error('Access token cannot be empty');
    }
  }

  getValue(): string {
    return this.value;
  }
}