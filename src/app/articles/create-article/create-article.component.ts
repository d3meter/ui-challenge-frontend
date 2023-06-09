import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Article } from '../article.model';
import { ArticlesService } from '../articles.service';
import { Subscription } from 'rxjs';
import { NgForm } from '@angular/forms';
import { TaglistFilterPipe } from '../pipes/taglist-filter.pipe';
@Component({
  selector: 'app-create-article',
  templateUrl: './create-article.component.html',
  styleUrls: ['./create-article.component.scss'],
})
export class CreateArticleComponent implements OnInit {
  successMessage: string;
  errorMessage: string;
  tagList: string[];

  constructor(private articlesService: ArticlesService) {}

  onSubmit(createArticleForm: NgForm, tagListInput: HTMLTextAreaElement) {
    const filteredTagList = new TaglistFilterPipe().transform(tagListInput.value.toString()) as string[];
    this.onCreateArticle(
      createArticleForm.value,
      filteredTagList,
      createArticleForm
    );
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
          this.successMessage = resData.statusText;
          setTimeout(() => {
            this.successMessage = '';
          }, 2000);
          setTimeout(() => {
            window.scrollTo(0, 0);
          }, 3000);
        },
        (error) => {
          this.errorMessage = error.message;
          console.log(error);
        }
      );
    createArticleForm.reset();
  }

  ngOnInit(): void {}
}
