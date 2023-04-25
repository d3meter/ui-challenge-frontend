import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { Article } from './article.model';
import { ArticlesService } from './articles.service';
import { UsersService } from '../auth/users.service';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.scss'],
})
export class ArticlesComponent implements OnInit {
  @Input() username: string;
  @Input() onlyFavorites: boolean = false;
  @ViewChild('articleList', { static: false }) articleList: ElementRef;

  articles: Article[] = [];
  selectedArticle: Article = null;
  displayValue = 'none';
  followedUsers: string[] = [];
  favoriteArticles: string[] = [];
  articlesLength: number = 0;

  constructor(
    private articlesService: ArticlesService,
    private usersService: UsersService
  ) {}

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
        this.followedUsers = this.usersService.getFollowedUsers();
        this.favoriteArticles = this.articlesService.getFavoriteArticles();
        if (this.onlyFavorites) {
          this.articles = this.articles.filter((article) =>
            this.favoriteArticles.includes(article.slug)
          );
        }
        for (let article of this.articles) {
          article.userIsFollowed = this.followedUsers.includes(
            article.author.username
          );
          article.articleIsFavorite = this.favoriteArticles.includes(
            article.slug
          );
        }
        this.articlesLength = this.articles.length;
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
