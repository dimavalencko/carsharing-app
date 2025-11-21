import { IsString, IsOptional } from 'class-validator';

export class UpdateDriverLicenseDto {
  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsString()
  @IsOptional()
  middleName?: string;

  @IsString()
  @IsOptional()
  birthPlace?: string;

  @IsString()
  @IsOptional()
  issuedBy?: string;
}