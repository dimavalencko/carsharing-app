import { IsString, IsNotEmpty, IsDateString, IsOptional } from 'class-validator';

export class AddDriverLicenseDto {
  @IsString()
  @IsNotEmpty()
  firstName!: string;

  @IsString()
  @IsNotEmpty()
  lastName!: string;

  @IsString()
  @IsOptional()
  middleName?: string;

  @IsDateString()
  birthDate!: string;

  @IsString()
  @IsNotEmpty()
  birthPlace!: string;

  @IsDateString()
  issueDate!: string;

  @IsDateString()
  expiryDate!: string;

  @IsString()
  @IsNotEmpty()
  issuedBy!: string;

  @IsString()
  @IsNotEmpty()
  licenseNumber!: string;
}