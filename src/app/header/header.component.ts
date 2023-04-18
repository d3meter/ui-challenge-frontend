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
  /*   @ViewChild('searchInput') searchInputRef: ElementRef; */

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

  @Output() pageToDisplaySelected = new EventEmitter<string>();

  onSelect(pageToDisplay: string) {
    this.pageToDisplaySelected.emit(pageToDisplay);
  }

  onLogout() {
    this.usersService.logOutUser();
  }
}
