import { inject, Injectable, signal } from '@angular/core';
import { User } from '../interfaces/user.interface';
import { HttpClient } from '@angular/common/http';
import { LoginResponse } from '../interfaces/login-response.interface';
import { catchError, map, Observable, tap } from 'rxjs';
import { TOKEN } from '../utils/constants';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  http = inject(HttpClient);

  isLogged = signal(false);

  private urlBase = 'http://localhost:3000/api/v1';

  login(username: string, password: string): Observable<boolean> {

    return this.http.post<LoginResponse>(`${this.urlBase}/auth/login`, { username, password }).pipe(
      tap({
        next: (response) => {
          sessionStorage.setItem('token', response.token);
          this.isLogged.update(() => true);
        },
      }),
      map((response) => {
        return response.success;
      }),
      catchError((error) => {
        console.error('From service', error);
        throw new Error('Credenciales no válidas');
      })
    );
  }


  //Método de referencia para ejemplo de programación immperativa:
  async login2(username: string, password: string): Promise<boolean> {
    try {
      const response = await this.http.post<LoginResponse>('http://localhost:3000/api/v1/auth/login', { username, password }).toPromise();
      console.log(response);
      return true;
    } catch (error) {
      console.error('Error', error);
      return false;
    }
  }


  logout() {
    this.isLogged.update(() => false);
  }

  registry(user: User): Observable<boolean> {
    return this.http.post<LoginResponse>(`${this.urlBase}/auth/sign-up`, user).pipe(
      tap({
        next: (response) => {
          sessionStorage.setItem(TOKEN, response.token);
          this.isLogged.update(() => true);
        },
      }),
      map((response) => {
        return response.success;
      }),
      catchError((error) => {
        console.error('From service', error);
        throw error;
      })
    );
  }


}
