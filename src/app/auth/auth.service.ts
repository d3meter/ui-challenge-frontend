import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Subject, catchError, tap, throwError, map } from 'rxjs';

import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isLoggedIn$ = new Subject<boolean>();

  constructor(private http: HttpClient, private configService: ConfigService) {}

  private get apiUrl(): string {
    return this.configService.apiUrl;
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      console.error('An error occurred:', error.error);
    } else {
      console.error(
        `Backend returned code ${error.status}, body was: `,
        error.error
      );
      error;
    }
    return throwError(
      () => new Error('Something bad happened; please try again later.')
    );
  }

  setLoggedIn(value: boolean) {
    this.isLoggedIn$.next(value);
    localStorage.setItem('loggedIn', 'true');
  }

  getLoggedIn() {
    return JSON.parse(localStorage.getItem('loggedIn') || 'false');
  }

  getAuthHeaders(): HttpHeaders {
    const storedData = JSON.parse(localStorage.getItem('userData'));
    const token = storedData.user.token;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return headers;
  }

/*   getAuthHeaders(): HttpHeaders {
    const storedData = JSON.parse(localStorage.getItem('userData'));
    const token = storedData && storedData.user ? storedData.user.token : null;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return headers;
  }
 */
  createUser(username: string, email: string, password: string) {
    const myUserData = {
      username: username,
      email: email,
      password: password,
    };
    return this.http.post(`${this.apiUrl}/users`, myUserData).pipe(
      tap((response: any) => console.log(response)),
      map((response: any) => {
        return {
          username: response.user.username,
          email: response.user.email,
          token: response.user.token,
          bio: response.user.bio,
          image: response.user.image,
        };
      }),
      catchError(this.handleError)
    );
  }

  logInUser(email: string, password: string) {
    const myUserData = {
      email: email,
      password: password,
    };
    return this.http.post(`${this.apiUrl}/login`, myUserData).pipe(
      catchError(this.handleError),
      tap((response: any) => {
        if (response && response.token) {
          localStorage.setItem('token', response.token);
          this.setLoggedIn(true);
        }
      })
    );
  }

  logOutUser() {
    this.setLoggedIn(false);
    localStorage.removeItem('token');
    localStorage.removeItem('loggedIn');
  }
}
