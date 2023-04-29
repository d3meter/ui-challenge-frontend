export interface User {
	id?: number;
	username?: string;
	email: string;
	token?: string;
	bio?: string;
	image?: string;
}

export interface UserRO {
	user: User;
}