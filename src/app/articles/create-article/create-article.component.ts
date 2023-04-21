import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Article } from '../article.model';
import { ArticlesService } from '../articles.service';
import { Subscription } from 'rxjs';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-create-article',
  templateUrl: './create-article.component.html',
  styleUrls: ['./create-article.component.scss'],
})
export class CreateArticleComponent implements OnInit {
  errorMessage: string;

  constructor(private http: HttpClient, private articlesService: ArticlesService) {}

  onCreateArticle(articleData: Article) {
    this.articlesService.createArticle(
      articleData.title,
      articleData.body,
      articleData.description,
    ).subscribe(
      (resData) => {
        console.log(resData);
        // Handle the successful response here
      },
      (error) => {
        this.errorMessage = error.message;
        console.log(error);
        // Handle the error here
      }
    );
  }

  ngOnInit(): void {
    
  }
  
}
