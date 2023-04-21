import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Article } from './article.model';
import { Subject, catchError, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ArticlesService {
  errorMessage = new Subject<string>();

  constructor(private http: HttpClient) {}

  createArticle(title: string, body: string, description: string) {
    const articleData: Article = {
      title: title,
      description: description,
      body: body,
    };
    const storedData = JSON.parse(localStorage.getItem('userData'));
    console.log(storedData.user.token);
    const token = storedData.user.token;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http
      .post('http://localhost:3000/api/articles', articleData, {
        headers: headers,
      })
      .pipe(catchError(this.handleError));
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
