// value-object для валидации почты
export class EmailValue {
  private constructor(private readonly value: string) {
    if (!this.isValidEmail(value)) {
      throw new Error('Invalid email format');
    }
  }

  static create(value: string): EmailValue {
    return new EmailValue(value);
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  getValue(): string {
    return this.value;
  }

  equals(other: EmailValue): boolean {
    return this.value === other.getValue();
  }
}
