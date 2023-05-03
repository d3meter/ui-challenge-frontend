import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ElementRef,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter
} from '@angular/core';

import { UsersService } from '../shared/users.service';
import { ArticlesService } from './articles.service';
import { ProfileService } from '../shared/profile.service';

import { Article } from './article.model';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.scss'],
})
export class ArticlesComponent implements OnInit, OnChanges {
  @Input() username: string;
  @Input() onlyFavorites: boolean = false;
  @Input() searchFor: string;
  @Output() userDataChanged = new EventEmitter<any>();
  @ViewChild('articleList', { static: false }) articleList: ElementRef;

  articles: Article[] = [];
  selectedArticle: Article = null;
  displayValue = 'none';
  followedUsers: string[] = [];
  favoriteArticles: string[] = [];
  articlesLength: number = 0;
  filteredArticles: Article[];
  userData: any;
  isLoading = true;

  constructor(
    private articlesService: ArticlesService,
    private usersService: UsersService,
    private profileService: ProfileService
  ) {}

  ngOnInit() {
    this.onGetArticles();
    this.onGetMyUserInfo();
  }

  onGetMyUserInfo() {
    this.usersService.getMyUserInfo().subscribe((response) => {
      this.userData = response.user;
      this.userDataChanged.emit(this.userData);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.searchFor) {
      this.onGetArticles(changes.searchFor.currentValue);
    }
  }

  onGetArticles(searchFor?: string) {
    this.articlesService.getArticles().subscribe(
      (response) => {
        if (this.username === null) {
          this.articles = response;
          setTimeout(() => {
            this.isLoading = false;
          }, 2000);
        } else {
          this.articles = response.filter(
            (article) => article.author.username === this.username
          );
          setTimeout(() => {
            this.isLoading = false;
          }, 2000);
        }
        this.followedUsers = this.profileService.getFollowedUsers();
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
          article.favorited = this.favoriteArticles.includes(
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
          setTimeout(() => {
            this.isLoading = false;
          }, 2000);
        } else {
          this.articlesLength = this.articles.length;
          this.filteredArticles = [...this.articles];
          setTimeout(() => {
            this.isLoading = false;
          }, 2000);
        }
      },
      (error: string) => {
        this.articlesService.errorMessage.next(error);
        setTimeout(() => {
          this.isLoading = false;
        }, 2000);
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
