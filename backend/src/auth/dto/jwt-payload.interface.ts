export interface JwtPayload {
  sub: number;
  email: string;
  companymail: string;
  iat?: number;
  exp?: number;
}
