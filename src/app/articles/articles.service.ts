import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
} from '@angular/common/http';
import { Subject, catchError, throwError, tap, map, Observable } from 'rxjs';

import { AuthService } from '../auth/auth.service';
import { ConfigService } from '../auth/config.service';
import { UsersService } from '../shared/users.service';

import { User } from '../shared/user.model';
import { Article } from './article.model';

@Injectable({ providedIn: 'root' })
export class ArticlesService {
  errorMessage = new Subject<string>();
  private favoriteArticles: string[] = [];

  constructor(
    private http: HttpClient,
    private usersService: UsersService,
    private authService: AuthService,
    private configService: ConfigService
  ) {}

  headers = this.authService.getAuthHeaders();
  private get apiUrl(): string {
    return this.configService.apiUrl;
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }

  getArticles() {
    return this.http
      .get<any>(`${this.apiUrl}/articles`, {
        headers: this.headers,
      })
      .pipe(
        catchError(this.handleError),
        map((response) => response.articles)
      );
  }

  getArticleBySlug(slug: string): Observable<Article> {
    return this.http
      .get<Article>(`${this.apiUrl}/articles/${slug}`, {
        headers: this.headers,
      })
      .pipe(catchError(this.handleError));
  }
/*   getArticleBySlug(slug: string): Observable<Article> {
    return this.http
      .get<Article>(`${this.apiUrl}/articles/${slug}`, {
        headers: this.headers,
      })
      .pipe(
        switchMap(articleData => {
          // retrieve author information using getMyUserInfo() method
          return this.usersService.getMyUserInfo().pipe(
            map(userRO => {
              // add author information to the article data
              return { ...articleData, author: userRO.user };
            })
          );
        }),
        catchError(this.handleError)
      );
  } */


  createArticle(
    title: string,
    body: string,
    description: string,
    tagList: string[]
  ) {
    const articleData: Article = {
      title: title,
      description: description,
      body: body,
      tagList: tagList,
    };
    return this.http
      .post(`${this.apiUrl}/articles`, articleData, {
        headers: this.headers,
        observe: 'response',
      })
      .pipe(
        catchError(this.handleError),
        map((response) => {
          const resData = response;
          return resData;
        })
      );
  }

  deleteArticle(slug: string) {
    return this.http
      .delete(`${this.apiUrl}/articles/${slug}`, {
        headers: this.headers,
      })
      .pipe(catchError(this.handleError));
  }

  updateArticle(
    slug: string,
    title: string,
    description: string,
    body: string,
    tagList: string[]
  ) {
    const articleData = {
      slug: slug,
      title: title,
      description: description,
      body: body,
      tagList: tagList,
    };
    return this.http.put(`${this.apiUrl}/articles/${slug}`, articleData, {
      headers: this.headers,
    });
  }

  addArticleToFavorites(slug: string) {
    return this.http
      .post(
        `${this.apiUrl}/articles/${slug}/favorite`,
        {},
        {
          headers: this.headers,
        }
      )
      .pipe(
        tap((response: any) => {
          this.favoriteArticles.push(slug);
          console.log(`Article ${slug} add to favorites successfully`);
        }),
        catchError(this.handleError)
      );
  }

  removeArticleFromFavorites(slug: string) {
    return this.http
      .delete(`${this.apiUrl}/articles/${slug}/favorite`, {
        headers: this.headers,
      })
      .pipe(
        tap((response: any) => {
          const index = this.favoriteArticles.indexOf(slug);
          if (index !== -1) {
            this.favoriteArticles.splice(index, 1);
          }
          console.log(`Article ${slug} removed from favorites successfully`);
        }),
        catchError(this.handleError)
      );
  }

  getFavoriteArticles(): string[] {
    return this.favoriteArticles;
  }

  getComments(slug: string) {
    return this.http
      .get<any>(`${this.apiUrl}/articles/${slug}/comments`, {
        headers: this.headers,
      })
      .pipe(
        catchError(this.handleError),
        map((response) => response.comments)
      );
  }

  createComment(slug: string, body: string, author: User) {
    return this.http
      .post<any>(
        `${this.apiUrl}/articles/${slug}/comments`,
        { body, author },
        {
          headers: this.headers,
        }
      )
      .pipe(
        tap((response) => console.log(response)),
        catchError(this.handleError)
      );
  }

  deleteComment(slug: string, id: number) {
    return this.http
      .delete(`${this.apiUrl}/articles/${slug}/comments/${id}`, {
        headers: this.headers,
      })
      .pipe(catchError(this.handleError));
  }
}
