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
  isLoginMode = false;
  error: string = null;
  private errorSub: Subscription;

  constructor(private http: HttpClient, private usersService: UsersService) {}

  ngOnInit(): void {
    this.errorSub = this.usersService.error.subscribe(errorMessage => {
      this.error = errorMessage;
    })
  }

  ngOnDestroy(): void {}

  onLogIn(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;

    this.isLoading = true;
    this.usersService.logInUser(email, password).subscribe(
      (resData) => {
        this.isLoading = false;
        console.log(resData);
      },
      (error) => {
        this.isLoading = false;
        console.log(error);
      }
    );
    this.isLoginMode = !this.isLoginMode;
    form.reset();
  }
}
