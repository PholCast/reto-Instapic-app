export interface JwtPayload {
  id:string;
  email: string;
  username: string;
  name:string;
  exp: number;
  iat?: number;
}
