import { Post } from "@/types/post";

interface PostCardProps {
  post: Post | null;
}

export default function PostCard({ post }: PostCardProps) {
  return (
    post && (
      <div className="space-y-6 bg-card p-8 rounded-xl">
        <div className="flex items-center space-x-4">
          <span className="w-12 h-12 rounded-full bg-foreground" />
          <div>
            <h3 className="text-lg font-semibold">{post.author.firstName}</h3>
            <p className="text-sm text-muted-foreground">{post.updatedAt}</p>
          </div>
        </div>
        <p className="text-lg">{post.content}</p>
        <div className="flex justify-end">
          <button className="text-sm text-blue-500 hover:underline">
            Like
          </button>
        </div>
      </div>
    )
  );
}
