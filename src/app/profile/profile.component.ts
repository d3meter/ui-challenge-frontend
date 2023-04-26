import { Component, OnInit, Input } from '@angular/core';
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
  editModeOn: boolean = false;

  constructor(private usersService: UsersService) {}

/*   ngOnInit() {
    const userDataString = localStorage.getItem('userData');
    this.userData = JSON.parse(userDataString).user;
  } */

  ngOnInit(): void {
    this.onGetMyUserInfo();
  }

/*   onGetMyUserInfo() {
    this.usersService
      .getMyUserInfo()
      .subscribe((response) => console.log(response));
  } */

  onGetMyUserInfo() {
    this.usersService.getMyUserInfo().subscribe((response) => {
      this.userData = response.user;
    });
  }

  onUpdateUser(userData: User) {
    this.usersService
      .updateUser(
        userData.username,
        userData.email,
        userData.bio,
        userData.image
      )
      .subscribe((response) => console.log(response));
      this.editModeOn = false;
  }

  onEditModeSwitch(editMode: boolean) {
    this.editModeOn = editMode;
    /*     this.editModeChanged.emit(this.editModeOn); */
  }
}
