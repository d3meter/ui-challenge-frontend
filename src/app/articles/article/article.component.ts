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

  constructor(
    private articlesService: ArticlesService,
    private usersService: UsersService,
    private el: ElementRef
  ) {}

  ngOnInit(): void {
    this.usersService.getMyUserInfo().subscribe((userInfo) => {
      this.isOwnArticle = this.article.author.username === userInfo.user.username;
    });
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
}
