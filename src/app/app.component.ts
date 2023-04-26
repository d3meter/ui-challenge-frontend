import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'ui-challenge-frontend';
  loadedPage = '';
  searchValue: string;

  onSearch(searchValue: string) {
    this.searchValue = searchValue;
  }

  ngOnInit(): void {}
  
  onNavigate(page: string) {
    this.loadedPage = page;
  }
}
