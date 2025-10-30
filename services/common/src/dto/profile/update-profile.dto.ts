import { IsString, IsOptional } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  profilePicture?: string;

  @IsOptional()
  @IsString()
  city?: string;
}