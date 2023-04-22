import { Component, OnInit, Input } from '@angular/core';
import { Article } from './article.model';
import { ArticlesService } from './articles.service';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.scss'],
})
export class ArticlesComponent implements OnInit {
  articles: Article[];
  selectedArticle: Article = null;
  displayValue = 'none';
  @Input() username: string;

  constructor(private articlesService: ArticlesService) {}

  ngOnInit() {
    this.articlesService.getArticles().subscribe(
      (response) => {
        if (this.username === null) {
          this.articles = response;
        } else {
          this.articles = response.filter(
            (article) => article.author.username === this.username
          );
        }
        console.log(response);
      },
      (error: string) => {
        this.articlesService.errorMessage.next(error);
      }
    );
  }

  onArticleSelected(article: Article): void {
    if (this.selectedArticle === article) {
      this.selectedArticle = null;
    } else {
      this.selectedArticle = article;
    }
  }
}
