import { Component, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
/*   @ViewChild('searchInput') searchInputRef: ElementRef; */

  @Output() pageToDisplaySelected = new EventEmitter<string>();

  onSelect(pageToDisplay: string) {
    this.pageToDisplaySelected.emit(pageToDisplay);
  }


  
}
