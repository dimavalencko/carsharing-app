import { IsString, IsNotEmpty } from 'class-validator';

export class DeleteUserByAdminDto {
  @IsString()
  @IsNotEmpty()
  userIdToDelete!: string;
}