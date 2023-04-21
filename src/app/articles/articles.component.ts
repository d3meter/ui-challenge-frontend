import { Component, OnInit } from '@angular/core';

import { Article } from './article.model';
import { ArticlesService } from './articles.service';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.scss'],
})
export class ArticlesComponent implements OnInit {
  articles: Article[];
  displayValue = 'none';

  constructor(private articlesService: ArticlesService) {}

  ngOnInit() {
    this.articlesService.getArticles().subscribe(
      (response) => {
        this.articles = response;
        console.log(response);
      },
      (error: string) => {
        this.articlesService.errorMessage.next(error);
      }
    );
  }
}