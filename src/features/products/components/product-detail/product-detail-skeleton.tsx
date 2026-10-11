import { Skeleton } from "@/components/ui/skeleton";

export function ProductDetailSkeleton() {
  return (
    <div className="wrapper space-y-3">
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-32" />
      </div>

      <div className="grid grid-cols-1 items-start gap-10 md:grid-cols-2">
        <div className="flex flex-col-reverse gap-3 md:sticky md:top-20 lg:flex-row">
          <div className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="size-17.5 shrink-0 rounded-md" />
            ))}
          </div>

          <Skeleton className="aspect-square flex-1 rounded-lg" />
        </div>

        <div>
          <Skeleton className="h-8 w-3/4" />

          <div className="mt-2 flex items-center gap-2">
            <Skeleton className="h-4 w-40" />
          </div>

          <Skeleton className="mt-1 h-4 w-32" />

          <div className="my-4 h-px bg-border" />

          <div className="flex items-baseline gap-3">
            <Skeleton className="h-7 w-14 rounded" />
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-6 w-24" />
          </div>

          <Skeleton className="mt-3 h-4 w-64" />

          <Skeleton className="mt-4 h-4 w-24" />

          <div className="mt-4 flex gap-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="size-9 rounded-full" />
            ))}
          </div>

          <Skeleton className="mt-5 h-4 w-56" />

          <div className="mt-4 space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3.5 w-full max-w-72" />
            <Skeleton className="h-3.5 w-full max-w-60" />
            <Skeleton className="h-3.5 w-full max-w-64" />
          </div>

          <div className="mt-6 flex items-center gap-3">
            <div className="flex items-center rounded-md border">
              <div className="p-2.5">
                <Skeleton className="size-4" />
              </div>
              <div className="w-10 border-x py-2 text-center">
                <Skeleton className="mx-auto h-4 w-4" />
              </div>
              <div className="p-2.5">
                <Skeleton className="size-4" />
              </div>
            </div>
            <Skeleton className="h-4 w-28" />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3">
            <Skeleton className="h-12 w-full rounded-md" />
            <Skeleton className="h-12 w-full rounded-md" />
          </div>

          <ul className="mt-5 space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <li key={i} className="flex items-start gap-2">
                <Skeleton className="mt-0.5 size-4 shrink-0 rounded-full" />
                <Skeleton className="h-4 w-full" />
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-10 rounded-lg border">
        <div className="flex w-full items-center gap-6 border-b px-4">
          <div className="py-3">
            <Skeleton className="h-4.5 w-28" />
          </div>
          <div className="py-3">
            <Skeleton className="h-4.5 w-32" />
          </div>
        </div>

        <div className="space-y-2.5 px-4 py-8">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-11/12" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="mt-4 aspect-video w-full rounded-lg" />
        </div>
      </div>

      <section className="py-6">
        <div className="mb-6 flex items-baseline justify-between">
          <Skeleton className="h-7 w-40" />
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-5 sm:grid-cols-3 sm:gap-x-5 sm:gap-y-6 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="flex flex-col">
              <Skeleton className="mb-3 aspect-square rounded-md" />
              <div className="mb-1.5 flex min-h-9.5 flex-col justify-center gap-1">
                <Skeleton className="h-4 w-full sm:h-5" />
                <Skeleton className="h-4 w-2/3 sm:h-5" />
              </div>
              <div className="mb-1 flex items-baseline gap-1.5 sm:gap-2">
                <Skeleton className="h-4 w-20 sm:h-5" />
                <Skeleton className="h-3 w-14 sm:h-4" />
              </div>
              <div className="flex justify-end">
                <Skeleton className="h-3 w-20 sm:h-4" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
