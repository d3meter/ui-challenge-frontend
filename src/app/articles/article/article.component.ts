import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { Article } from '../article.model';
import { ArticlesService } from '../articles.service';
import { UsersService } from 'src/app/shared/users.service';
import { NgForm } from '@angular/forms';
import { User } from 'src/app/shared/user.model';
import { Comment } from '../comment.model';
import { Profile } from 'src/app/shared/profile.model';
import { ProfileService } from 'src/app/shared/profile.service';
import { DateFormatPipe } from '../pipes/date-format.pipe';
import { Observable, map } from 'rxjs';
import { TaglistFilterPipe } from '../pipes/taglist-filter.pipe';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss'],
  providers: [DateFormatPipe],
})
export class ArticleComponent implements OnInit, OnChanges {
  @Input() article: Article;
  @Input() isSelected: boolean;
  @Output() onSelected = new EventEmitter<Article>();
  @ViewChild('content') body: ElementRef;
  @Input() userData: any;

  userToFollow: string;
  userToUnFollow: string;

  @Input() userIsFollowed: boolean;
  @Input() favorited: boolean;

  isOwnArticle: boolean;

  editModeOn: boolean = false;
  deleteConfirmOn: boolean = false;

  comments: Comment[];
  newComment: string;
  tagList: string[];
  tagListOutput: string;
  isLoading = true;

  isSubmitFetching = false;

  constructor(
    private articlesService: ArticlesService,
    private usersService: UsersService,
    private profileService: ProfileService,
    private el: ElementRef
  ) {}

  ngOnInit(): void {
    this.onGetCommentsBySlug(this.article.slug);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.userData) {
      this.isOwnArticle =
        this.article.author.username === this.userData.username;
    }
  }

  toggleContent(): void {
    this.onSelected.emit(this.article);
    this.isSelected = !this.isSelected;
    if (this.isSelected) {
      setTimeout(() => {
        this.scrollToContent();
      }, 0);
    }
  }

  scrollToContent() {
    this.el.nativeElement
      .querySelector('#content')
      .scrollIntoView({ behavior: 'smooth' });
  }

  onDeleteArticle(slug: string) {
    this.articlesService.deleteArticle(slug).subscribe(
      (response) => {
        console.log(`Article ${slug} deleted successfully`);
        location.reload();
      },
      (error) => {
        console.error('Error delete article: ', error);
      }
    );
  }

  toggleDeleteConfirm(deleteConfirm: boolean) {
    this.deleteConfirmOn = deleteConfirm;
  }

  onSubmit(updateArticleForm: NgForm, tagListOutput: HTMLTextAreaElement) {
    const filteredTagList = new TaglistFilterPipe().transform(
      tagListOutput.value.toString()
    ) as string[];
    this.onUpdateArticle(
      updateArticleForm.value,
      filteredTagList,
      updateArticleForm
    );
    this.editModeOn = false;
  }

  onUpdateArticle(
    articleData: Article,
    tagList: string[],
    updateArticleForm: NgForm
  ) {
    this.isSubmitFetching = true;
    const filteredTagList = new TaglistFilterPipe().transform(tagList.toString());
    this.articlesService
      .updateArticle(
        articleData.slug,
        articleData.title,
        articleData.description,
        articleData.body,
        filteredTagList
      )
      .subscribe(
        (response) => {
          console.log(`Article ${articleData.slug} updated successfully`);
          location.reload();
        },
        (error) => {
          console.error('Error update article: ', error);
        }
      );
  }

  onGetArticleBySlug(slug: string): Observable<{ article: Article }> {
    return this.articlesService
      .getArticleBySlug(slug)
      .pipe(map((article) => ({ article: article })));
  }

  onFollowUser(userToFollow: string) {
    this.profileService.followUser(userToFollow).subscribe(
      (profile: Profile) => {
        console.log(`User ${profile.username} followed successfully`);
        this.userIsFollowed = true;
      },
      (error) => {
        console.error('Error following user: ', error);
      }
    );
  }

  onUnFollowUser(userToUnFollow: string): void {
    this.profileService.unFollowUser(userToUnFollow).subscribe(
      (response) => {
        console.log('User unfollowed successfully');
      },
      (error) => {
        console.error('Error unfollowing user: ', error);
      }
    );
    this.userIsFollowed = false;
  }

  onAddArticleToFavorites(slug: string) {
    this.articlesService.addArticleToFavorites(slug).subscribe(
      (response) => {
        console.log(`Article ${slug} add to favorites successfully`);
      },
      (error) => {
        console.error('Error adding to favorites: ', error);
      }
    );
    this.favorited = true;
  }

  onRemoveArticleFromFavorites(slug: string) {
    this.articlesService.removeArticleFromFavorites(slug).subscribe(
      (response) => {
        console.log(`Article ${slug} removed from favorites successfully`);
      },
      (error) => {
        console.error('Error removing from favorites: ', error);
      }
    );
    this.favorited = false;
  }

  onEditModeSwitch(editMode: boolean) {
    this.editModeOn = editMode;
    /*     this.editModeChanged.emit(this.editModeOn); */
  }

  onGetCommentsBySlug(slug: string) {
    this.articlesService.getComments(slug).subscribe(
      (response) => {
        this.comments = response;
        setTimeout(() => {
          this.isLoading = false;
        }, 1000);
      },
      (error) => {
        console.error('Error getting comments: ', error);
      }
    );
  }

  onCreateComment(slug: string, body: string, author: User) {
    body = this.newComment;
    this.articlesService.createComment(slug, body, author).subscribe(
      (response) => {
        console.log(`Comment submitted to article: ${slug}`);
        this.newComment = '';
        location.reload()
        /*         const commentsOfArticle = response.article.comments
        console.log(commentsOfArticle);
        this.article.comments = [];
        console.log(this.article.comments);
        if (commentsOfArticle) {
          this.article.comments.push(commentsOfArticle[commentsOfArticle.length-1]);
        } else {
          this.article.comments = [commentsOfArticle[commentsOfArticle.length-1]];
        } */
      },
      (error) => {
        console.error('Error submit comment: ', error);
      }
    );
  }

  onDeleteComment(slug: string, id: number) {
    this.articlesService.deleteComment(slug, id).subscribe(
      (response) => {
        console.log(`Comment deleted successfully at ${slug}`);
      },
      (error) => {
        console.error('Error delete comment:', error);
      }
    );
  }
}
