import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { UsersService } from './shared/users.service';
import { Subscription } from 'rxjs';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'ui-challenge-frontend';
  loadedPage = '';
  searchValue: string;
  isLoggedIn: boolean;
  private isLoggedInSub: Subscription;

  constructor(
    private usersService: UsersService,
    private authService: AuthService
  ) {}

  onSearch(searchValue: string) {
    this.searchValue = searchValue;
  }

  ngOnInit(): void {
    this.isLoggedIn = this.authService.getLoggedIn();
    this.isLoggedInSub = this.authService.isLoggedIn$.subscribe(
      (isLoggedIn: boolean) => {
        this.isLoggedIn = isLoggedIn;
      }
    );

    if (
      this.isLoggedIn &&
      (!this.loadedPage || this.loadedPage.trim() === '')
    ) {
      this.onNavigate('articles');
    }
  }

  onNavigate(page: string) {
    this.loadedPage = page;
  }
}
