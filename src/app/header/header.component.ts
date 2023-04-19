import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { UsersService } from '../auth/users.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  isLoggedIn = false;
  private isLoggedInSub: Subscription;
  userData: any;
  /*   @ViewChild('searchInput') searchInputRef: ElementRef; */

  constructor(private usersService: UsersService) {}

  ngOnInit(): void {
    this.isLoggedIn = this.usersService.getLoggedIn();
    this.isLoggedInSub = this.usersService.isLoggedIn$.subscribe(
      (isLoggedIn: boolean) => {
        this.isLoggedIn = isLoggedIn;
      }
    );
    const userDataString = localStorage.getItem('userData');
    this.userData = JSON.parse(userDataString).user;
  }

  ngOnDestroy() {
    this.isLoggedInSub.unsubscribe();
  }

  @Output() pageToDisplaySelected = new EventEmitter<string>();

  onSelect(pageToDisplay: string) {
    this.pageToDisplaySelected.emit(pageToDisplay);
  }

  onLogout() {
    localStorage.removeItem('userData');
    this.usersService.logOutUser();
  }
}
