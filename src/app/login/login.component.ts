import {
  Component,
  OnDestroy,
  OnInit,
  Output,
  EventEmitter,
} from '@angular/core';
import { AuthService } from '../auth/auth.service';
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
  @Output() pageLoaded = new EventEmitter<string>();
  loadedPage: string;

  constructor(private authService: AuthService) {}

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
