import { UserRoles } from "../enums";

export interface JwtPayload {
  userId: string;
  login: string;
  role: UserRoles;
  exp?: number;
  iat?: number;
}

export class JwtPayloadValue {
  constructor(private readonly payload: JwtPayload) {}

  getUserId(): string {
    return this.payload.userId;
  }

  getLogin(): string {
    return this.payload.login;
  }

  getRole(): UserRoles {
    return this.payload.role;
  }

  getExpiration(): number | undefined {
    return this.payload.exp;
  }

  isExpired(): boolean {
    return this.payload.exp ? this.payload.exp < Date.now() / 1000 : true;
  }
}