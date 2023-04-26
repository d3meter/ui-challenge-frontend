import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ElementRef,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { Article } from './article.model';
import { ArticlesService } from './articles.service';
import { UsersService } from '../auth/users.service';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.scss'],
})
export class ArticlesComponent implements OnInit, OnChanges {
  @Input() username: string;
  @Input() onlyFavorites: boolean = false;
  @ViewChild('articleList', { static: false }) articleList: ElementRef;
  @Input() searchFor: string;

  articles: Article[] = [];
  selectedArticle: Article = null;
  displayValue = 'none';
  followedUsers: string[] = [];
  favoriteArticles: string[] = [];
  articlesLength: number = 0;
  filteredArticles: Article[];

  constructor(
    private articlesService: ArticlesService,
    private usersService: UsersService
  ) {}

  ngOnInit() {
    this.onGetArticles();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.searchFor) {
      console.log(`New search value: ${changes.searchFor.currentValue}`);
      this.onGetArticles(changes.searchFor.currentValue);
    }
  }

  onGetArticles(searchFor?: string) {
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

        if (searchFor) {
          const filterValue = searchFor.toLowerCase();
          this.filteredArticles = this.articles.filter(
            (article) =>
              article.title.toLowerCase().includes(filterValue) ||
              article.description.toLowerCase().includes(filterValue) ||
              article.body.toLowerCase().includes(filterValue) ||
              article.tagList.some((tag) => tag.toLowerCase().includes(filterValue))
          );
          this.articlesLength = this.filteredArticles.length;
        } else {
          this.articlesLength = this.articles.length;
          this.filteredArticles = [...this.articles];
        }
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

  /*   onSearch(searchFor): void {
    if (!searchFor) {
      this.filteredArticles = [...this.articles];
      return;
    }
    const filterValue = searchFor.toLowerCase();
    this.filteredArticles = this.articles.filter(
      (article) =>
        article.title.toLowerCase().includes(filterValue) ||
        article.description.toLowerCase().includes(filterValue) ||
        article.body.toLowerCase().includes(filterValue)
    );
  } */
}
