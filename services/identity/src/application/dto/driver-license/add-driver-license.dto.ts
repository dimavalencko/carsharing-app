export interface AddDriverLicenseDto {
  firstName: string;
  lastName: string;
  middleName?: string;
  birthDate: Date;
  birthPlace: string;
  issueDate: Date;
  expiryDate: Date;
  issuedBy: string;
  licenseNumber: string;
}
