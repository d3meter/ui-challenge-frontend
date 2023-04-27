import {
  Component,
  EventEmitter,
  Output,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { UsersService } from '../auth/users.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Output() pageToDisplaySelected = new EventEmitter<string>();
  @Output() searchFor = new EventEmitter<string>();

  isLoggedIn = false;
  private isLoggedInSub: Subscription;
  userData: any;
  pageToDisplay: string

  constructor(private usersService: UsersService) {}

  ngOnInit(): void {
    this.isLoggedIn = this.usersService.getLoggedIn();
    this.isLoggedInSub = this.usersService.isLoggedIn$.subscribe(
      (isLoggedIn: boolean) => {
        this.isLoggedIn = isLoggedIn;
      }
    );
  }

  ngOnDestroy() {
    this.isLoggedInSub.unsubscribe();
  }

  onSelect(pageToDisplay) {
    this.pageToDisplaySelected.emit(pageToDisplay);
  }
  
  onSetSearch(searchValue: string) {
    this.searchFor.emit(searchValue);
  }

  onLogout() {
    localStorage.removeItem('userData');
    this.usersService.logOutUser();
  }
}
