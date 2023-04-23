import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { User } from './user.model';
import { Subject, catchError, tap, throwError, Observable, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UsersService {
  errorMessage = new Subject<string>();
  isLoggedIn$ = new Subject<boolean>();
  private followedUsers: string[] = [];

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

  getUserInfo(username: string) {
    return this.http.get(`http://localhost:3000/api/profiles/${username}`).pipe(
      tap((data) => console.log('getUserInfo response', data)),
      catchError(this.handleError)
    );
  }

  getAllUsers() {
    const storedData = JSON.parse(localStorage.getItem('userData'));
    const token = storedData.user.token;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http
      .get<any>(`http://localhost:3000/api/users`, { headers })
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
    const storedData = JSON.parse(localStorage.getItem('userData'));
    const token = storedData.user.token;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http
      .post(
        `http://localhost:3000/api/profiles/${userToFollow}/follow`,
        {},
        { headers }
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
    const storedData = JSON.parse(localStorage.getItem('userData'));
    const token = storedData.user.token;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http
      .delete(`http://localhost:3000/api/profiles/${userToUnFollow}/follow`, {
        headers,
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

  /*   followUser(userToFollow: string): Observable<any> {
    const storedData = JSON.parse(localStorage.getItem('userData'));
    const token = storedData.user.token;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
    return this.http
      .post(
        `http://localhost:3000/api/profiles/${userToFollow}/follow`,
        {},
        { headers }
      )
      .pipe(
        tap((response: any) => {
          if (!storedData.followedUsers.includes(userToFollow)) {
            storedData.followedUsers.push(userToFollow);
            localStorage.setItem('userData', JSON.stringify(storedData));
          }
          console.log(`User ${userToFollow} followed successfully`);
        }),
        catchError(this.handleError)
      );
  }
  
  unFollowUser(userToUnFollow: string): Observable<any> {
    const storedData = JSON.parse(localStorage.getItem('userData'));
    const token = storedData.user.token;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
    return this.http
      .delete(
        `http://localhost:3000/api/profiles/${userToUnFollow}/follow`,
        { headers }
      )
      .pipe(
        tap((response: any) => {
          const index = storedData.followedUsers.indexOf(userToUnFollow);
          if (index !== -1) {
            storedData.followedUsers.splice(index, 1);
            localStorage.setItem('userData', JSON.stringify(storedData));
          }
          console.log(`User ${userToUnFollow} unfollowed successfully`);
        }),
        catchError(this.handleError)
      );
  } */

  getFollowedUsers(): string[] {
    return this.followedUsers;
  }

  logOutUser() {
    this.setLoggedIn(false);
    localStorage.removeItem('token');
    localStorage.removeItem('loggedIn');
  }

  getMyUserInfo(): Observable<any> {
    const storedData = JSON.parse(localStorage.getItem('userData'));
    const token = storedData.user.token;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get('http://localhost:3000/api/user', {
      headers: headers,
    });
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

  deleteUser(email: string) {
    const storedData = JSON.parse(localStorage.getItem('userData'));
    const token = storedData.user.token;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.delete(`http://localhost:3000/api/users/${email}`, {
      headers,
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
