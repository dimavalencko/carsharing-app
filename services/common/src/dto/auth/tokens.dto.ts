export class TokensDto {
  constructor(data: Partial<TokensDto>) {
    Object.assign(this, data)
  }
  accessToken!: string;
  refreshToken!: string;
}