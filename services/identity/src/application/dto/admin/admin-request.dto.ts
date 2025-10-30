export class CreateUserByAdminRequestDto {
  username: string;
  password: string;
  firstName: string;
  lastName?: string;
  middleName?: string;
}

export class CreateAdminRequestDto {
  username: string;
  password: string;
  firstName: string;
  lastName?: string;
  middleName?: string;
}

export class DeleteUserByAdminRequestDto {
  userIdToDelete: string;
}
