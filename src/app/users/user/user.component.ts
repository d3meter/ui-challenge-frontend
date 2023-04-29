import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

import { UsersService } from 'src/app/shared/users.service';
import { User } from 'src/app/shared/user.model';
import { ProfileService } from 'src/app/shared/profile.service';
import { Profile } from 'src/app/shared/profile.model';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {
  @Input() user: User;
  @Input() isSelectedUser: boolean;
  @Input() userIsFollowed: boolean;
  @Output() onSelectedUser = new EventEmitter<User>();

  userToFollow: string;
  userToUnFollow: string;

  isOwnArticle: boolean;
  isSuperUser: boolean;

  constructor(
    private usersService: UsersService,
    private profileService: ProfileService
  ) {}

  ngOnInit(): void {
    this.usersService.getMyUserInfo().subscribe((userInfo) => {
      this.isOwnArticle = this.user.username === userInfo.user.username;
    });

    this.usersService.getMyUserInfo().subscribe((userInfo) => {
      this.isSuperUser = 'Superuser' === userInfo.user.username;
    });
  }

  toggleContent(): void {
    this.onSelectedUser.emit(this.user);
    this.isSelectedUser = !this.isSelectedUser;
  }

  //not in use
  onGetUserInfo(username: string) {
    this.usersService.getUserInfo(username).subscribe((data) => {
      console.log(data);
    });
  }

  onFollowUser(userToFollow: string) {
    this.profileService.followUser(userToFollow).subscribe(
      (profile: Profile) => {
        console.log(`User ${profile.username} followed successfully`);
        this.userIsFollowed = true;
      },
      (error) => {
        console.error('Error following user: ', error);
      }
    );
  }

  onUnFollowUser(userToUnFollow: string): void {
    this.profileService.unFollowUser(userToUnFollow).subscribe(
      (response) => {
        console.log('User unfollowed successfully');
      },
      (error) => {
        console.error('Error unfollowing user: ', error);
      }
    );
    this.userIsFollowed = false;
  }

  onDeleteUser(email: string) {
    this.usersService.deleteUser(email).subscribe(
      (response) => {
        console.log('User: ${email} deleted successfully');
      },
      (error) => {
        console.error('Error delete user: ', error);
      }
    );
  }
}
