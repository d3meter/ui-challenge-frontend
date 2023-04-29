import { Comment } from "./comment.model";
import { User } from "../auth/user.model";

export interface ArticleData {
  slug: string;
  title: string;
  description: string;
  body?: string;
  tagList?: string[];
  createdAt?: number;
  updatedAt?: number;
  favorited?: boolean;
  favoritesCount?: number;
  author?: User;
  comments?: Comment[];
}

export interface CommentsRO {
  comments: Comment[];
}

export interface ArticleRO {
  article: ArticleData;
}

export interface ArticlesRO {
  articles: ArticleData[];
  articlesCount: number;
}