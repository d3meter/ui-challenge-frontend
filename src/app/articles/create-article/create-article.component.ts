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
  tagList: string[];

  constructor(
    private http: HttpClient,
    private articlesService: ArticlesService
  ) {}

  onSubmit(createArticleForm: NgForm, tagListInput: HTMLTextAreaElement) {
    const formattedTagList = this.taglistFormat(tagListInput.value);
    this.onCreateArticle(
      createArticleForm.value,
      formattedTagList,
      createArticleForm
    );
  }

  taglistFormat(value: string): string[] {
    const filterValue = value
      .replace(/[,.*+?^${}()|[\]\\]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    const arrayFrom = filterValue.split(' ');

    return arrayFrom;
  }

  onCreateArticle(
    articleData: Article,
    tagList: string[],
    createArticleForm: NgForm
  ) {
    this.articlesService
      .createArticle(
        articleData.title,
        articleData.body,
        articleData.description,
        tagList
      )
      .subscribe(
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
    createArticleForm.reset();
  }

  ngOnInit(): void {}
}
