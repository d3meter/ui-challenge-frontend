export interface Profile {
	username: string;
	bio: string;
	image?: string;
	email?: string,
	following: boolean;
	userIsFollowed?: boolean;
}