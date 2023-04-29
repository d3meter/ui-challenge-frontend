import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpResponse
} from '@angular/common/http';
import { Article } from './article.model';
import { UsersService } from '../auth/users.service';
import { Subject, catchError, throwError, tap, map, Observable } from 'rxjs';
import { User } from '../auth/user.model';

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
      .post('http://localhost:3000/api/articles', articleData, {
        headers: this.headers,
        observe: 'response',
      })
      .pipe(
        catchError(this.handleError),
        map(response => {
          const resData = response;
          return resData;
        })
      );
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

  getComments(slug: string) {
    return this.http
      .get<any>(`http://localhost:3000/api/articles/${slug}/comments`, {
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
        `http://localhost:3000/api/articles/${slug}/comments`,
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
      .delete(`http://localhost:3000/api/articles/${slug}/comments/${id}`, {
        headers: this.headers,
      })
      .pipe(catchError(this.handleError));
  }
}
