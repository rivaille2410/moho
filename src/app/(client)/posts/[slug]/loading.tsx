import { Skeleton } from "@/components/ui/skeleton";
import { PublicApiLoadingHint } from "@/components/shared/public-api-loading-hint";

export default function PostDetailLoading() {
  return (
    <div className="space-y-8 pb-12">
      <div className="wrapper">
        <Skeleton className="h-4 w-44" />
      </div>
      <div className="wrapper grid grid-cols-1 gap-10 pt-6 pb-12 lg:grid-cols-[350px_1fr]">
        <PublicApiLoadingHint className="lg:col-start-2" />
        <div className="hidden space-y-3 lg:block">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="ml-3 h-4 w-4/6" />
          <Skeleton className="h-4 w-full" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-9 w-2/3" />
          <Skeleton className="aspect-video w-full rounded-lg" />
          {Array.from({ length: 9 }).map((_, index) => (
            <Skeleton key={index} className="h-4 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}
