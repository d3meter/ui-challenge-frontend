import {
  Component,
  EventEmitter,
  Output,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { Subscription } from 'rxjs';

import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Output() pageToDisplaySelected = new EventEmitter<string>();
  @Output() searchFor = new EventEmitter<string>();
  
  private isLoggedInSub: Subscription;
  isLoggedIn = false;
  userData: any;
  pageToDisplay: string;

  constructor(
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = this.authService.getLoggedIn();
    this.isLoggedInSub = this.authService.isLoggedIn$.subscribe(
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
    this.authService.logOutUser();
  }
}
