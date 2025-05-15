import { UserProfile } from "./user";
import { Reaction } from "./reaction";
interface Post {
  id: string;
  content: string;
  imageUrl?: string;
  authorId: string;
  author: UserProfile;
  reactions: Reaction[];
  createdAt: string;
  updatedAt: string;
}
