export interface Article {
  title: string;
  description: string;
  body: string;
  slug?: string;
  tagList?: [string];
  author?: {
    username: string;
  };
  created?: number;
  articleIsFavorite?: boolean;
  userIsFollowed?: boolean;
}
