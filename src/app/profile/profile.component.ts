import { Component, OnInit } from '@angular/core';
import { User } from '../auth/user.model';
import { UsersService } from '../auth/users.service';
import { ArticlesComponent } from '../articles/articles.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  userData: any;

  constructor(private usersService: UsersService) {}

  ngOnInit() {
    const userDataString = localStorage.getItem('userData');
    this.userData = JSON.parse(userDataString).user;
  }

  onUpdateUser(userData: User) {
    this.usersService
      .updateUser(userData.username, userData.email, userData.bio, userData.image)
      .subscribe((response) => console.log(response));
  }
}
