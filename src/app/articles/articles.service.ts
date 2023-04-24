import { Injectable, EventEmitter } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Article } from './article.model';
import { Subject, catchError, throwError, tap, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ArticlesService {
  errorMessage = new Subject<string>();
  private favoriteArticles: string[] = [];

  constructor(private http: HttpClient) {}

  getArticles() {
    const storedData = JSON.parse(localStorage.getItem('userData'));
    const token = storedData.user.token;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http
      .get<any>('http://localhost:3000/api/articles', {
        headers,
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
    const storedData = JSON.parse(localStorage.getItem('userData'));
    const token = storedData.user.token;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http
      .post('http://localhost:3000/api/articles', articleData, {
        headers: headers,
      })
      .pipe(catchError(this.handleError));
  }

  deleteArticle(slug: string) {
    const storedData = JSON.parse(localStorage.getItem('userData'));
    const token = storedData.user.token;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http
      .delete(`http://localhost:3000/api/articles/${slug}`, {
        headers: headers,
      })
      .pipe(catchError(this.handleError));
  }

  addArticleToFavorites(slug: string) {
    const storedData = JSON.parse(localStorage.getItem('userData'));
    const token = storedData.user.token;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http
      .post(
        `http://localhost:3000/api/articles/${slug}/favorite`,
        {},
        {
          headers: headers,
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
    const storedData = JSON.parse(localStorage.getItem('userData'));
    const token = storedData.user.token;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http
      .delete(`http://localhost:3000/api/articles/${slug}/favorite`, {
        headers: headers,
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
}
