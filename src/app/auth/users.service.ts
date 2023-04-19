import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { User } from './user.model';
import { Subject, catchError, tap, throwError } from 'rxjs';
import jwt_decode from 'jwt-decode';

@Injectable({ providedIn: 'root' })
export class UsersService {
  errorMessage = new Subject<string>();
  isLoggedIn$ = new Subject<boolean>();

  constructor(private http: HttpClient) {}

  setLoggedIn(value: boolean) {
    this.isLoggedIn$.next(value);
    localStorage.setItem('loggedIn', 'true');
  }

  getLoggedIn() {
    return JSON.parse(localStorage.getItem('loggedIn') || 'false');
  }

  createUser(username: string, email: string, password: string) {
    const userData: User = {
      username: username,
      email: email,
      password: password,
    };
    this.http
      .post('http://localhost:3000/api/users', userData)
      .pipe(catchError(this.handleError))
      .subscribe(
        (resData) => {
          console.log(resData);
        },
        (error) => {
          this.errorMessage.next(error.error);
          console.log(error);
        }
      );
  }

  logInUser(email: string, password: string) {
    const userData: User = {
      email: email,
      password: password,
    };
    return this.http.post('http://localhost:3000/api/login', userData).pipe(
      catchError(this.handleError),
      tap((response: any) => {
        if (response && response.token) {
          localStorage.setItem('token', response.token);
          this.setLoggedIn(true);
        }
      })
    );
  }

  getUserInfo() {
    console.log('getUserInfo called');
    return this.http.get('http://localhost:3000/api/user').pipe(
      tap((data) => console.log('getUserInfo response', data)),
      catchError(this.handleError)
    );
  }

  logOutUser() {
    this.setLoggedIn(false);
    localStorage.removeItem('token');
    localStorage.removeItem('loggedIn');
  }

  updateUser(username: string, email: string, bio: string, image: string) {
    const userData = {
      username: username,
      email: email,
      bio: bio,
      image: image,
    };
    const storedData = JSON.parse(localStorage.getItem('userData'));
    console.log(storedData.user.token);
    const token = storedData.user.token;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put('http://localhost:3000/api/user', userData, {
      headers: headers,
    });
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
}
