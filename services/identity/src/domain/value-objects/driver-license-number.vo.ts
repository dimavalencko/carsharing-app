// value-object для валидации номера водительских прав
export class DriverLicenseNumberValue {
  private constructor(private readonly value: string) {
    if (!value || value.length < 5) {
      throw new Error('Driver license number must be at least 5 characters long');
    }
  }

  static create(value: string): DriverLicenseNumberValue {
    return new DriverLicenseNumberValue(value);
  }

  getValue(): string {
    return this.value;
  }

  equals(licenseNumber: DriverLicenseNumberValue): boolean {
    return this.value === licenseNumber.getValue();
  }
}