import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Subject, catchError, tap, throwError, Observable, map } from 'rxjs';

import { AuthService } from '../auth/auth.service';
import { ConfigService } from '../auth/config.service';
import { User, UserRO } from './user.model';

@Injectable({ providedIn: 'root' })
export class UsersService {
  errorMessage = new Subject<string>();
  isLoggedIn$ = new Subject<boolean>();
  private followedUsers: string[] = [];

  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    private authService: AuthService
  ) {}

  private get apiUrl(): string {
    return this.configService.apiUrl;
  }
  headers = this.authService.getAuthHeaders();

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

  getUserInfo(username: string) {
    return this.http.get(`${this.apiUrl}/profiles/${username}`).pipe(
      tap((data) => console.log('getUserInfo response', data)),
      catchError(this.handleError)
    );
  }

  getAllUsers() {
    return this.http
      .get<any>(`${this.apiUrl}/users`, {
        headers: this.headers,
      })
      .pipe(
        map((response) => {
          const users = response.map((userData) => {
            return {
              id: userData.id,
              username: userData.username,
              email: userData.email,
              bio: userData.bio || '',
              image: userData.image || '',
            };
          });
          return users;
        }),
        catchError(this.handleError)
      );
  }

  followUser(userToFollow: string): Observable<any> {
    return this.http
      .post(
        `${this.apiUrl}/profiles/${userToFollow}/follow`,
        {},
        { headers: this.headers }
      )
      .pipe(
        tap((response: any) => {
          this.followedUsers.push(userToFollow);
          console.log(`User ${userToFollow} followed successfully`);
        }),
        catchError(this.handleError)
      );
  }

  unFollowUser(userToUnFollow: string): Observable<any> {
    return this.http
      .delete(`${this.apiUrl}/profiles/${userToUnFollow}/follow`, {
        headers: this.headers,
      })
      .pipe(
        tap((response: any) => {
          const index = this.followedUsers.indexOf(userToUnFollow);
          if (index !== -1) {
            this.followedUsers.splice(index, 1);
          }
          console.log(`User ${userToUnFollow} unfollowed successfully`);
        }),
        catchError(this.handleError)
      );
  }

  getFollowedUsers(): string[] {
    return this.followedUsers;
  }

/*   getMyUserInfo(): Observable<UserRO> {
    return this.http
      .get<UserRO>(`${this.apiUrl}/user`, {
        headers: this.headers,
      })
      .pipe(
        tap((response: any) => console.log(response)),
        catchError(this.handleError)
      );
  } */
  getMyUserInfo(): Observable<any> {
    return this.http.get(`${this.apiUrl}/user`, {
      headers: this.headers,
    });
  }

  updateMyUserInfo(
    username: string,
    email: string,
    bio: string,
    image: string
  ) {
    const userData = {
      username: username,
      email: email,
      bio: bio,
      image: image,
    };
    return this.http
      .put(`${this.apiUrl}/user`, userData, {
        headers: this.headers,
        observe: 'response',
      })
      .pipe(
        tap((response: any) => console.log(response)),
        catchError(this.handleError)
      );
  }

  deleteUser(email: string) {
    return this.http.delete(`${this.apiUrl}/users/${email}`, {
      headers: this.headers,
    });
  }
}
