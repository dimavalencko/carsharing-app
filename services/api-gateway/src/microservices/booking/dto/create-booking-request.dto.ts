import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class CreateBookingRequestDto {
  @IsString()
  @IsNotEmpty()
  carId: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;
}
