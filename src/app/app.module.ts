import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { ArticlesComponent } from './articles/articles.component';
import { RegistrationComponent } from './registration/registration.component';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { CreateArticleComponent } from './articles/create-article/create-article.component';
import { ArticleComponent } from './articles/article/article.component';
import { DateFormatPipe } from './articles/pipes/date-format.pipe';
import { UsersComponent } from './users/users.component';
import { UserComponent } from './users/user/user.component';
import { FavoritesComponent } from './articles/favorites/favorites.component';
import { TaglistFormatPipe } from './articles/pipes/taglist-format.pipe';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ArticlesComponent,
    RegistrationComponent,
    LoginComponent,
    ProfileComponent,
    CreateArticleComponent,
    ArticleComponent,
    DateFormatPipe,
    UsersComponent,
    UserComponent,
    FavoritesComponent,
    TaglistFormatPipe,
  ],
  imports: [BrowserModule, FormsModule, ReactiveFormsModule, HttpClientModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
