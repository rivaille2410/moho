import { Skeleton } from "@/components/ui/skeleton";

export default function ProductDetailSkeleton() {
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
    </div>
  );
}
