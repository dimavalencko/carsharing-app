// value-object для валидации номера телефона
export class PhoneNumberValue {
  private constructor(private readonly value: string) {
    // Проверяем что телефон не пустая строка и соответствует формату
    if (!value || value.trim().length === 0) {
      throw new Error('Phone number cannot be empty');
    }
    
    if (!/^\+?[\d\s\-()]+$/.test(value)) {
      throw new Error('Invalid phone number format');
    }
    
    // Проверяем что есть хотя бы одна цифра
    if (!/\d/.test(value)) {
      throw new Error('Phone number must contain at least one digit');
    }
  }

  static create(value: string): PhoneNumberValue {
    return new PhoneNumberValue(value);
  }

  getValue(): string {
    return this.value;
  }
}