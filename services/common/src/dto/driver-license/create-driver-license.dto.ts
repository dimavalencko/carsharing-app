import { IsString, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateDriverLicenseDto {
  @IsString()
  licenseNumber: string;

  @IsDate()
  @Type(() => Date)
  issueDate: Date;

  @IsDate()
  @Type(() => Date)
  expirationDate: Date;
}