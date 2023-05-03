import {
  Component,
  OnDestroy,
  OnInit,
  Output,
  EventEmitter,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { NgForm } from '@angular/forms';

import { AuthService } from '../auth/auth.service';
import { UsersService } from '../shared/users.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  @Output() pageLoaded = new EventEmitter<string>();

  private isLoggedInSub: Subscription;
  isLoading = false;
  isLoggedIn = false;
  error: string = null;
  loadedPage: string;

  constructor(
    private authService: AuthService,
    private usersService: UsersService
  ) {}

  ngOnInit() {
    this.isLoggedIn = this.authService.getLoggedIn();
    this.isLoggedInSub = this.authService.isLoggedIn$.subscribe(
      (isLoggedIn: boolean) => {
        this.isLoggedIn = isLoggedIn;
      }
    );
  }

  ngOnDestroy() {}

  onLogIn(email: string, password: string, loginForm: NgForm) {
    this.isLoading = true;
    this.authService.logInUser(email, password).subscribe(
      (resData) => {
        this.isLoading = false;
        this.authService.setLoggedIn(true);
        this.isLoggedIn = true;
        localStorage.setItem('userData', JSON.stringify(resData));
        this.usersService.getMyUserInfo();
        this.loadedPage = 'articles';
        setTimeout(() => {
          this.pageLoaded.emit(this.loadedPage);
          location.reload();
        }, 2000);
        loginForm.reset();
      },
      (error) => {
        if (error.error && error.error.errors && error.error.errors.User) {
          this.error = error.error.errors.User;
        } else {
          this.error = 'Wrong email or password!';
        }
        this.isLoading = false;
      }
    );
  }

  onLogout() {
    localStorage.removeItem('userData');
    this.authService.logOutUser();
    this.authService.setLoggedIn(false);
    this.isLoggedIn = false;
  }
}
