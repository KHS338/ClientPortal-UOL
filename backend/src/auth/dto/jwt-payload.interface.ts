export interface JwtPayload {
  sub: number;
  email: string;
  firstName: string;
  lastName: string;
  iat?: number;
  exp?: number;
}
