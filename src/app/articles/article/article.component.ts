import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { Article } from '../article.model';
import { ArticlesService } from '../articles.service';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss'],
})
export class ArticleComponent implements OnInit {
  @Input() article: Article;
  @Input() isSelected: boolean;
  @Output() onSelected = new EventEmitter<Article>();
  @ViewChild('content') body: ElementRef;

  constructor(
    private articlesService: ArticlesService,
    private el: ElementRef
  ) {}

  ngOnInit(): void {
    console.log(this.article);
  }

  toggleContent(): void {
    this.onSelected.emit(this.article);
    this.isSelected = !this.isSelected;
    if (this.isSelected) {
      setTimeout(() => {
        this.scrollToContent();
      }, 0);
    }
  }

  scrollToContent() {
    this.el.nativeElement
      .querySelector('#content')
      .scrollIntoView({ behavior: 'smooth' });
  }
}
