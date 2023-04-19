import { Component, OnInit } from '@angular/core';
import { UsersService } from '../auth/users.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  userData: any;

  constructor(private usersService: UsersService) { }

  ngOnInit() {
    const userDataString = localStorage.getItem('userData');
    this.userData = JSON.parse(userDataString).user;
    };
  }

