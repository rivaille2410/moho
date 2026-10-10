import { Skeleton } from "@/components/ui/skeleton";
import { PublicApiLoadingHint } from "@/components/shared/public-api-loading-hint";
import { PostCardSkeleton } from "../(home)/_components/post-card";

export default function PostsLoading() {
  return (
    <div className="space-y-3 pb-16">
      <div className="wrapper">
        <Skeleton className="h-4 w-32" />
      </div>
      <div className="wrapper space-y-6">
        <PublicApiLoadingHint />
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-10 w-full sm:w-64" />
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-5 sm:grid-cols-3 sm:gap-x-5 lg:grid-cols-4">
          {Array.from({ length: 12 }).map((_, index) => (
            <PostCardSkeleton key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
