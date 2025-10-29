import { UserRoles } from "../enums";

export interface JwtPayload {
  userId: string;
  login: string;
  role: UserRoles | string;
  exp?: number;
  iat?: number;
}

export class JwtPayloadValue {
  private constructor(private readonly payload: JwtPayload) {}

  static create(payload: JwtPayload): JwtPayloadValue {
    return new JwtPayloadValue(payload);
  }

  getUserId() { return this.payload.userId; }
  getLogin() { return this.payload.login; }
  getRole() { return this.payload.role; }
  getExpiration() { return this.payload.exp; }
  getIssuedAt() { return this.payload.iat; }

  isExpired(): boolean {
    return this.payload.exp ? this.payload.exp < Date.now() / 1000 : true;
  }

  toObject(): JwtPayload {
    return { ...this.payload };
  }
}