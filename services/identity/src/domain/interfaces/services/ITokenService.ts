export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  hasDriverLicense: boolean;
}

export interface ITokenService {
  generateAccessToken(payload: JwtPayload): string;
  generateRefreshToken(): string;
  
  verifyAccessToken(token: string): JwtPayload;
  verifyRefreshToken(token: string): boolean;
  
  decodeToken(token: string): JwtPayload | null;
  getTokenExpiration(token: string): Date | null;
}