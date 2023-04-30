import { Component, OnInit, Input } from '@angular/core';
import { UsersService } from '../shared/users.service';
import { User } from '../shared/user.model';
import { Profile } from '../shared/profile.model';
import { ProfileService } from '../shared/profile.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  @Input() username: string;

  allUsers: Profile[] = [];
  users: User[];
  selectedUser: User = null;
  followedUsers: string[] = [];

  constructor(private usersService: UsersService, private profileService: ProfileService) {}

  ngOnInit(): void {
    this.onGetAllUsers();
    this.followedUsers = this.profileService.getFollowedUsers();
  }

  onGetAllUsers() {
    this.usersService.getAllUsers().subscribe(
      (allUsers: Profile[]) => {
        this.allUsers = allUsers;
        for (let user of this.allUsers) {
          user.userIsFollowed = this.followedUsers.includes(user.username);
        }
      },
      (error) => {
        console.error('Error retrieving users: ', error);
      }
    );
  }

  onUserSelected(user: User): void {
    if (this.selectedUser === user) {
      this.selectedUser = null;
    } else {
      this.selectedUser = user;
    }
  }
}
