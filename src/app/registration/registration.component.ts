import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../auth/user.model';
import { UsersService } from '../auth/users.service';
import { Subscription } from 'rxjs';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent implements OnInit, OnDestroy {
  isLoading = false;
  error: string = null;
  private errorSub: Subscription;
  
  constructor(private http: HttpClient, private usersService: UsersService) {}
  
  ngOnInit(): void {
    this.errorSub = this.usersService.errorMessage.subscribe(errorMessage => {
      this.error = errorMessage;
    })
  }

  ngOnDestroy(): void {}

  onCreateUser(userData: User) {
    this.usersService.createUser(
      userData.username,
      userData.email,
      userData.password
    );
  }

}
