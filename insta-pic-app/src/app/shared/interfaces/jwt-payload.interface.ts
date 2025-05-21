export interface JwtPayload {
  userId:string;
  email: string;
  username: string;
  exp: number;
  iat?: number;
}
