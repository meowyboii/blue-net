import { UserProfile } from "./user";
interface Post {
  id: string;
  content: string;
  imageUrl?: string;
  authorId: string;
  author: UserProfile;
  createdAt: string;
  updatedAt: string;
}
