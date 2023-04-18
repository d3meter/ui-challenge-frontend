import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../auth/user.model';
import { UsersService } from '../auth/users.service';
import { Subscription } from 'rxjs';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  isLoading = false;
  isLoggedIn = false;
  private isLoggedInSub: Subscription;
  error: string = null;
  private errorSub: Subscription;

  constructor(private http: HttpClient, private usersService: UsersService) {}

  ngOnInit() {
    this.errorSub = this.usersService.errorMessage.subscribe((errorMessage) => {
      this.error = errorMessage;
    });
    this.isLoggedIn = this.usersService.getLoggedIn();
    this.isLoggedInSub = this.usersService.isLoggedIn$.subscribe(
      (isLoggedIn: boolean) => {
        this.isLoggedIn = isLoggedIn;
      }
    );
  }

  ngOnDestroy() {}

  onLogIn(userData: User) {
    this.isLoading = true;
    this.usersService.logInUser(userData.email, userData.password).subscribe(
      (resData) => {
        console.log(resData);
        this.isLoading = false;
        this.usersService.setLoggedIn(true);
        this.isLoggedIn = true;
      },
      (error) => {
        if (error.error && error.error.errors && error.error.errors.User) {
          this.error = error.error.errors.User;
        } else {
          this.error = 'An unknown error occurred.';
        }
        console.log(this.error);
        this.isLoading = false;
      }
    );
  }

  onLogout() {
    this.usersService.logOutUser();
    this.usersService.setLoggedIn(false);
    this.isLoggedIn = false;
  }
}
