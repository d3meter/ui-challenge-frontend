import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { Article } from '../article.model';
import { ArticlesService } from '../articles.service';
import { UsersService } from 'src/app/auth/users.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss'],
})
export class ArticleComponent implements OnInit {
  @Input() article: Article;
  @Input() isSelected: boolean;
  @Output() onSelected = new EventEmitter<Article>();
  @ViewChild('content') body: ElementRef;

  userToFollow: string;
  userToUnFollow: string;

  @Input() userIsFollowed: boolean;
  @Input() articleIsFavorite: boolean;

  isOwnArticle: boolean;

  editModeOn: boolean = false;
  /*   @Output() editModeChanged = new EventEmitter<boolean>(); */
  deleteConfirmOn: boolean = false;

  comments: Comment[];
  newComment: string;
  userData: any;
  tagList: string[];
  tagListOutput: string;

  constructor(
    private articlesService: ArticlesService,
    private usersService: UsersService,
    private el: ElementRef
  ) {}

  ngOnInit(): void {
    this.usersService.getMyUserInfo().subscribe((userInfo) => {
      this.isOwnArticle =
        this.article.author.username === userInfo.user.username;
    });

    this.articlesService.getComments(this.article.slug).subscribe(
      (response) => {
        this.comments = response;
      },
      (error) => {
        console.error('Error getting comments: ', error);
      }
    );

    const userDataString = localStorage.getItem('userData');
    this.userData = JSON.parse(userDataString).user;
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
      },
      (error) => {
        console.error('Error delete article: ', error);
      }
    );
  }

  toggleDeleteConfirm(deleteConfirm: boolean) {
    this.deleteConfirmOn = deleteConfirm;
    /*     this.editModeChanged.emit(this.editModeOn); */
  }

  onSubmit(updateArticleForm: NgForm, tagListOutput: HTMLTextAreaElement) {
    const formattedTagList = this.tagListFormat(tagListOutput.value.toString());
    this.onUpdateArticle(
      updateArticleForm.value,
      formattedTagList,
      updateArticleForm
    );
    this.editModeOn = false;
  }

  tagListFormat(value: string): string[] {
    if (typeof value !== 'string') {
      return [];
    }
    const formatValue = value
      .toLowerCase()
      .replace(/[,.*+?^${}();:_|/[\]\\]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    const arrayFormated = formatValue.split(' ');

    return arrayFormated;
  }

  onUpdateArticle(
    articleData: Article,
    tagList: string[],
    updateArticleForm: NgForm
  ) {
    this.articlesService
      .updateArticle(
        articleData.slug,
        articleData.title,
        articleData.description,
        articleData.body,
        tagList
      )
      .subscribe(
        (response) => {
          console.log(`Article ${articleData.slug} updated successfully`);
        },
        (error) => {
          console.error('Error update article: ', error);
        }
      );
  }

  onGetUserInfo(username: string) {
    this.usersService.getUserInfo(username).subscribe((data) => {
      console.log(data);
    });
  }

  onFollowUser(userToFollow: string) {
    this.usersService.followUser(userToFollow).subscribe(
      (response) => {
        console.log('User followed successfully');
      },
      (error) => {
        console.error('Error following user: ', error);
      }
    );
    this.userIsFollowed = true;
  }

  onUnFollowUser(userToUnFollow: string): void {
    this.usersService.unFollowUser(userToUnFollow).subscribe(
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
    this.articleIsFavorite = true;
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
    this.articleIsFavorite = false;
  }

  onEditModeSwitch(editMode: boolean) {
    this.editModeOn = editMode;
    /*     this.editModeChanged.emit(this.editModeOn); */
  }

  onCreateComment(slug: string, body: string) {
    body = this.newComment;
    this.articlesService.createComment(slug, body).subscribe(
      (response) => {
        console.log(`Comment submitted to article: ${slug}`);
        this.newComment = '';
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
