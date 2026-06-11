import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class CreateBookingDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  carId: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;
}
