import { UserAggregate } from '@/domain/aggregates/user';
import { AuthResponseDto, TokensDto } from '../dto/auth/auth-response.dto';
import { TokenPair } from '@/domain/services/auth.service';

export class AuthMapper {
  static toAuthResponse(
    userAggregate: UserAggregate,
    tokenPair: TokenPair,
  ): AuthResponseDto {
    const user = userAggregate.getUser();

    return {
      userId: user.getId(),
      username: user.getLogin().getValue(),
      role: user.getRole(),
      accessToken: tokenPair.accessToken.getValue(),
      refreshToken: tokenPair.refreshToken.getValue(),
    };
  }

  static toTokensDto(tokenPair: TokenPair): TokensDto {
    return {
      accessToken: tokenPair.accessToken.getValue(),
      refreshToken: tokenPair.refreshToken.getValue(),
    };
  }
}
