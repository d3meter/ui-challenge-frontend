import { User } from '../shared/user.model';

export interface Article {
  slug?: string;
  title: string;
  description: string;
  body?: string;
  tagList?: string[];
  created?: number;
  updatedAt?: number;
  favorited?: boolean;
  author?: User;
  userIsFollowed?: boolean;
  comments?: Comment[];
}
