import {
  Component,
  EventEmitter,
  Output,
} from '@angular/core';
import { UsersService } from '../auth/users.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  @Output() pageToDisplaySelected = new EventEmitter<string>();

  isLoggedIn = false;
  private isLoggedInSub: Subscription;
  userData: any;

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

  onSelect(pageToDisplay: string) {
    this.pageToDisplaySelected.emit(pageToDisplay);
  }

  onLogout() {
    localStorage.removeItem('userData');
    this.usersService.logOutUser();
  }
}
