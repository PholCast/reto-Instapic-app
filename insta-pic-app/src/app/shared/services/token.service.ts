import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { TOKEN } from '../utils/constants';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable({
  providedIn: 'root'
})
export class TokenService {


  getToken(): string | null {
    return sessionStorage.getItem(TOKEN);
  }

  decodeToken(): JwtPayload | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      return jwtDecode<JwtPayload>(token);
    } catch (error) {
      console.error('Token inválido:', error);
      return null;
    }
  }

  isTokenExpired(): boolean {
    const payload = this.decodeToken();
    if (!payload?.exp) return true;

    const now = Math.floor(Date.now() / 1000); // tiempo en segundos
    return payload.exp < now;
  }

  clearToken(): void {
    sessionStorage.removeItem(TOKEN);
  }

}
