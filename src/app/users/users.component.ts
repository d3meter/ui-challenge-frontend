import { Component, OnInit, Input } from '@angular/core';
import { UsersService } from '../shared/users.service';
import { User } from '../shared/user.model';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  @Input() username: string;

  users: User[];
  selectedUser: User = null;
  followedUsers: string[] = [];

  constructor(private usersService: UsersService) {}

  ngOnInit(): void {
    this.usersService.getAllUsers().subscribe(
      (response) => {
        this.users = response;
        for (let user of this.users) {
/*           user.userIsFollowed = this.followedUsers.includes(user.username); */
        }
      },
      (error: string) => {
        this.usersService.errorMessage.next(error);
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
