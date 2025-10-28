// value-object для валидации номера телефона
export class PhoneNumberValue {
  private constructor(private readonly value: string) {
    if (value && !/^\+?[\d\s\-()]+$/.test(value)) {
      throw new Error('Invalid phone number format');
    }
  }

  static create(value: string): PhoneNumberValue {
    return new PhoneNumberValue(value);
  }

  getValue(): string {
    return this.value;
  }
}