import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { UsersService } from 'src/app/auth/users.service';
import { User } from 'src/app/auth/user.model';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {
  @Input() user: User;
  @Input() isSelectedUser: boolean;
  @Output() onSelectedUser = new EventEmitter<User>();
  @ViewChild('content') body: ElementRef;

  userToFollow: string;
  userToUnFollow: string;

  @Input() userIsFollowed: boolean;

  isOwnArticle: boolean;
  isSuperUser: boolean;

  constructor(
    private usersService: UsersService,
    private el: ElementRef
  ) {}

  ngOnInit(): void {
    this.usersService.getMyUserInfo().subscribe((userInfo) => {
      this.isOwnArticle = this.user.username === userInfo.user.username;
      console.log(this.isOwnArticle);
      console.log(userInfo);
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
    this.usersService.followUser(userToFollow).subscribe(
      (response) => {
        console.log('User followed successfully');
      },
      (error) => {
        console.error('Error following user: ', error);
      }
    );
    this.userIsFollowed = true;
  }

  onUnFollowUser(userToUnFollow: string): void {
    this.usersService.unFollowUser(userToUnFollow).subscribe(
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
