import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function PostSkeleton() {
  return (
    <SkeletonTheme
      baseColor="oklch(0.72 0.01 270 /0.2)"
      highlightColor="oklch(0.75 0.01 270 /0.2)"
    >
      <div className="rounded-lg p-4 mb-4">
        <div className="flex items-center space-x-4 mb-4">
          {/* Avatar */}
          <Skeleton circle width={48} height={48} />

          {/* Name */}
          <div className="flex-1">
            <Skeleton height={16} width="30%" className="mb-2" />
            <Skeleton height={12} width="20%" />
          </div>
        </div>

        {/* Post content */}
        <Skeleton height={12} width="100%" className="mb-2" />
        <Skeleton height={12} width="90%" className="mb-2" />
        <Skeleton height={12} width="70%" />
      </div>
    </SkeletonTheme>
  );
}
