import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { UsersService } from './auth/users.service';
import { Subscription } from 'rxjs';

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

  constructor(private usersService: UsersService) {}

  onSearch(searchValue: string) {
    this.searchValue = searchValue;
  }

  ngOnInit(): void {
    this.isLoggedIn = this.usersService.getLoggedIn();
    this.isLoggedInSub = this.usersService.isLoggedIn$.subscribe(
      (isLoggedIn: boolean) => {
        this.isLoggedIn = isLoggedIn;
      }
    );

    if (this.isLoggedIn && (!this.loadedPage || this.loadedPage.trim() === '')) {
      this.onNavigate('articles');
    }
  } 

  onNavigate(page: string) {
    this.loadedPage = page;
  }

}
