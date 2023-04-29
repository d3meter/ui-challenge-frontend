import { Component, OnInit } from '@angular/core';

import { UsersService } from '../shared/users.service';
import { User, UserRO } from '../shared/user.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  myUserData: User;
  editModeOn: boolean = false;

  successMessage: string;
  errorMessage: string;

  constructor(private usersService: UsersService) {}

  ngOnInit(): void {
    this.onGetMyUserInfo();
  }

  onGetMyUserInfo() {
    this.usersService.getMyUserInfo().subscribe((response: UserRO) => {
      this.myUserData = response.user;
      console.log(response.user);
    });
  }

  onUpdateMyUserInfo(userData: User) {
    this.usersService
      .updateMyUserInfo(
        userData.username,
        userData.email,
        userData.bio,
        userData.image
      )
      .subscribe((response) => {
        if (response.status === 200) {
          this.successMessage = 'Updated successfully!';
          setTimeout(() => {
            this.successMessage = null;
          }, 3000);
        } else {
          this.errorMessage = 'Error updating user info!';
        }
        this.editModeOn = false;
      });
  }

  onEditModeSwitch(editMode: boolean) {
    this.editModeOn = editMode;
  }
}
