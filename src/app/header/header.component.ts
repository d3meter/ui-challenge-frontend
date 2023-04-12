import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  @Output() pageToDisplaySelected = new EventEmitter<string>();

  onSelect(pageToDisplay: string) {
    this.pageToDisplaySelected.emit(pageToDisplay);
  }
}
