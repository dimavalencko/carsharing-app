export class PasswordHash {
  constructor(private readonly value: string) {}

  getValue(): string {
    return this.value;
  }

  equals(other: PasswordHash): boolean {
    return this.value === other.getValue();
  }
}