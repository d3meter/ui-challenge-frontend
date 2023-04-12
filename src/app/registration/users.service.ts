import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from './user.model';
import { Subject, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UsersService {
  error = new Subject<string>();

  constructor(private http: HttpClient) {}

  createUser(username: string, email: string, password: string) {
    const userData: User = {
      username: username,
      email: email,
      password: password,
    };
    this.http
      .post<{ name: string }>('http://localhost:3000/api/users', userData)
      .subscribe(
        (resData) => {
          console.log(resData);
        },
        (error) => {
          this.error.next(error.message);
        }
      );
  }
}
