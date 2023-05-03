import {
  Component,
  OnDestroy,
  OnInit,
  Output,
  EventEmitter,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
/* import bcrypt from 'bcryptjs'; */
import { AuthService } from '../auth/auth.service';

import { User } from '../shared/user.model';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent implements OnInit, OnDestroy {
  @Output() pageLoaded = new EventEmitter<string>();

  isLoading = false;
  isFetching = false;
  error: string = null;
  errorMessage: string;
  postForm: FormGroup;
  showPasswordRequirements = false;
  loadedPage: string;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {
    this.postForm = this.formBuilder.group(
      {
        username: [
          '',
          [
            Validators.required,
            Validators.pattern('^[a-zA-Z0-9_]+$'),
            Validators.minLength(4),
          ],
        ],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirm_password: ['', Validators.required],
      },
      {
        validator: this.confirmedValidator('password', 'confirm_password'),
      }
    );
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {}

  onCreateUser(user: User) {
    const password = this.postForm.controls.password.value;
    console.log(user.username, user.email, password);
    this.isFetching = true;
    this.authService.createUser(user.username, user.email, password).subscribe(
      (resData) => {
        this.isFetching = false;
        this.isLoading = true;
        this.loadedPage = 'login';
        setTimeout(() => {
          this.pageLoaded.emit(this.loadedPage);
        }, 3000);
      },
      (error: Error) => {
        this.isFetching = false;
        this.errorMessage = error.message;
      }
    );
  }

  confirmedValidator(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (
        matchingControl.errors &&
        !matchingControl.errors.confirmedValidator
      ) {
        return;
      }

      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({
          confirmedValidator: true,
          mismatch: true,
        });
      } else {
        matchingControl.setErrors(null);
      }
    };
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
