import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Article } from './article.model';
import { UsersService } from '../auth/users.service';
import { Subject, catchError, throwError, tap, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ArticlesService {
  errorMessage = new Subject<string>();
  private favoriteArticles: string[] = [];

  constructor(private http: HttpClient, private userService: UsersService) {}

  headers = this.userService.getAuthHeaders();

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
      .get<any>('http://localhost:3000/api/articles', {
        headers: this.headers,
      })
      .pipe(
        catchError(this.handleError),
        map((response) => response.articles)
      );
  }

  createArticle(title: string, body: string, description: string) {
    const articleData: Article = {
      title: title,
      description: description,
      body: body,
    };
    return this.http
      .post('http://localhost:3000/api/articles', articleData, {
        headers: this.headers,
      })
      .pipe(catchError(this.handleError));
  }

  deleteArticle(slug: string) {
    return this.http
      .delete(`http://localhost:3000/api/articles/${slug}`, {
        headers: this.headers,
      })
      .pipe(catchError(this.handleError));
  }

  updateArticle(
    slug: string,
    title: string,
    description: string,
    body: string
  ) {
    const articleData = {
      slug: slug,
      title: title,
      description: description,
      body: body,
    };
    return this.http.put(
      `http://localhost:3000/api/articles/${slug}`,
      articleData,
      {
        headers: this.headers,
      }
    );
  }

  addArticleToFavorites(slug: string) {
    return this.http
      .post(
        `http://localhost:3000/api/articles/${slug}/favorite`,
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
      .delete(`http://localhost:3000/api/articles/${slug}/favorite`, {
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
}
