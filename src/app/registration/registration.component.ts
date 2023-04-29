import {
  Component,
  OnDestroy,
  OnInit,
  Output,
  EventEmitter,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import bcrypt from 'bcryptjs';
import { User } from '../shared/user.model';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent implements OnInit, OnDestroy {
  isLoading = false;
  isFetching = false;
  error: string = null;
  errorMessage: string;

  @Output() pageLoaded = new EventEmitter<string>();
  loadedPage: string;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {}

  onCreateUser(user: User, password: string) {
    console.log(user);
    this.isFetching = true;
    this.authService
      .createUser(user.username, user.email, password)
      .subscribe(
        (resData) => {
          this.isFetching = false;
          this.isLoading = true;
          this.loadedPage = 'login';
          setTimeout(() => {
            this.pageLoaded.emit(this.loadedPage);
          }, 3000);
        },
        (error) => {
          this.isFetching = false;
          console.log(error);
          this.errorMessage = error.message;
        }
      );
  }

  /*   private saltRounds = 10;

  onCreateUser(myUserData: Profile, password: any, postForm: NgForm) {
    this.isFetching = true;
    const passwordString = password.toString();
    bcrypt.genSalt(this.saltRounds).then((salt) => {
      bcrypt
        .hash(passwordString, salt)
        .then((hashedPassword) => {
          this.authService
            .createUser(myUserData.username, myUserData.email, hashedPassword)
            .subscribe(
              (resData) => {
                this.isFetching = false;
                this.isLoading = true;
                this.loadedPage = 'login';
                setTimeout(() => {
                  this.pageLoaded.emit(this.loadedPage);
                }, 3000);
              },
              (error) => {
                this.isFetching = false;
                console.log(error);
              }
            );
        })
        .catch((err) => {
          console.log(err);
        });
    });
  } */
}
