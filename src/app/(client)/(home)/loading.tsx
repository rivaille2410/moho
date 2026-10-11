import { Skeleton } from "@/components/ui/skeleton";
import { PublicApiLoadingHint } from "@/components/shared/public-api-loading-hint";
import { ProductCardSkeleton } from "./_components/product-card";
import { PostCardSkeleton } from "./_components/post-card";

function ProductSectionSkeleton() {
  return (
    <div className="wrapper">
      <section className="py-6">
        <div className="mb-6 flex items-baseline justify-between">
          <Skeleton className="h-7 w-52" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-5 sm:grid-cols-3 sm:gap-x-5 sm:gap-y-6 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
          {Array.from({ length: 12 }, (_, index) => (
            <div
              key={index}
              className={index >= 4 ? "max-sm:hidden" : undefined}
            >
              <ProductCardSkeleton />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default function HomeLoading() {
  return (
    <main>
      <PublicApiLoadingHint className="wrapper" />

      <div className="relative aspect-square w-full sm:aspect-16/5">
        <Skeleton className="absolute inset-0 rounded-none" />
      </div>

      <ProductSectionSkeleton />

      <section className="wrapper py-6">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-5">
          {Array.from({ length: 3 }, (_, index) => (
            <Skeleton key={index} className="aspect-[9/4] w-full rounded-md" />
          ))}
        </div>
      </section>

      {Array.from({ length: 4 }, (_, index) => (
        <ProductSectionSkeleton key={index} />
      ))}

      <section className="wrapper py-6">
        <Skeleton className="mb-6 h-7 w-52" />
        <div className="flex overflow-hidden">
          {Array.from({ length: 5 }, (_, index) => (
            <div
              key={index}
              className="relative mx-5 h-12 w-32 shrink-0 sm:mx-8 sm:h-14 sm:w-40"
            >
              <Skeleton className="size-full" />
            </div>
          ))}
        </div>
      </section>

      <section className="wrapper pb-12">
        <div className="py-6">
          <div className="mb-6 flex items-baseline justify-between">
            <Skeleton className="h-7 w-40" />
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="-ml-3 flex overflow-hidden sm:-ml-5">
            {Array.from({ length: 6 }, (_, index) => (
              <div
                key={index}
                className="shrink-0 basis-1/2 pl-3 sm:basis-1/3 sm:pl-5 lg:basis-1/4 xl:basis-1/5 2xl:basis-1/6"
              >
                <PostCardSkeleton />
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
