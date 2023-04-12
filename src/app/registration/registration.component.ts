import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from './user.model';
import { UsersService } from './users.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent implements OnInit, OnDestroy {
  isFetching = false;
  error = null;
  private errorSub: Subscription;

  constructor(private http: HttpClient, private usersService: UsersService) {}

  onCreateUser(userData: User) {
    this.usersService.createUser(
      userData.username,
      userData.email,
      userData.password
    );
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {}
}
