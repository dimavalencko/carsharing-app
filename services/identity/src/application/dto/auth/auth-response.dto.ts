export class TokensDto {
  accessToken: string;
  refreshToken: string;
}

export class AuthResponseDto {
  userId: string;
  username: string;
  role: string;
  accessToken: string;
  refreshToken: string;
}
