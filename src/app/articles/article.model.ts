export interface Article {
  title: string;
  description: string;
  body: string;
  tagList?: [string];
  author?: {
    username: string;
  };
  created?: number;
  slug?: string;
  articleIsFavorite?: boolean;
  userIsFollowed?: boolean;
}
