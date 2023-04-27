import { User } from "../auth/user.model";

export interface Comment {
 body: string;
 author?: User;
 id?: number;
 created?: number;
}