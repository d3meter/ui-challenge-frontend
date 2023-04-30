import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
} from '@angular/common/http';
import { Subject, catchError, throwError, Observable, map, tap } from 'rxjs';

import { AuthService } from '../auth/auth.service';
import { ConfigService } from '../auth/config.service';
import { Profile } from './profile.model';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
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


/*   followUser(userToFollow: string): Observable<Profile> {
    return this.http
      .post(
        `${this.apiUrl}/profiles/${userToFollow}/follow`,
        {},
        { headers: this.headers }
      )
      .pipe(
        map((response: any) => {
          console.log(response);
          const profile: Profile = {
            username: response.profile.username,
            bio: response.profile.bio,
            image: response.profile.image,
            following: true
          };
          console.log(`User ${profile.username} followed successfully`);
          this.followedUsers.push(userToFollow)
          return profile;
        }),
        catchError(this.handleError)
      );
  } */

  followUser(userToFollow: string): Observable<any> {
    return this.http
      .post(
        `http://localhost:3000/api/profiles/${userToFollow}/follow`,
        {},
        { headers: this.headers }
      )
      .pipe(
        tap((response: any) => {
          this.followedUsers.push(userToFollow);
          console.log(`User ${userToFollow} followed successfully`);
          console.log(this.followedUsers);
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
}
