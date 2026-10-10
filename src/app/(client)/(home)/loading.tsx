import { Skeleton } from "@/components/ui/skeleton";
import { PublicApiLoadingHint } from "@/components/shared/public-api-loading-hint";
import { ProductCardSkeleton } from "./_components/product-card";
import { PostCardSkeleton } from "./_components/post-card";

export default function HomeLoading() {
  return (
    <main className="space-y-12 pb-12">
      <PublicApiLoadingHint className="wrapper" />
      <div className="wrapper">
        <Skeleton className="aspect-[16/6] w-full rounded-xl" />
      </div>

      {[0, 1].map((section) => (
        <section key={section} className="wrapper space-y-5">
          <Skeleton className="h-7 w-52" />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))}
          </div>
        </section>
      ))}

      <section className="wrapper space-y-5">
        <Skeleton className="h-7 w-40" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <PostCardSkeleton key={index} />
          ))}
        </div>
      </section>
    </main>
  );
}
