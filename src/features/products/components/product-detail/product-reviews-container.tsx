"use client";

import { useEffect, useMemo, useState } from "react";

import { Review } from "@/types/review";
import { formatRelativeTimeVi } from "@/lib/format-relative-time";

import { Skeleton } from "@/components/ui/skeleton";
import ProductReviews, { type ProductReview } from "./product-reviews";

import { usePublicReviews } from "@/features/reviews/hooks/use-public-reviews";
import { useReviewSummary } from "@/features/reviews/hooks/use-review-summary";
import { useToggleReviewHelpful } from "@/features/reviews/hooks/use-toggle-review-helpful";

interface ProductReviewsContainerProps {
  slug: string;
  className?: string;
}

const PAGE_SIZE = 10;

function mapReview(r: Review): ProductReview {
  return {
    id: r.id,
    rating: r.rating as 1 | 2 | 3 | 4 | 5,
    author: {
      id: r.author.userId ?? `guest-${r.id}`,
      name: r.author.name,
      avatarUrl: r.author.avatarUrl,
      memberSinceYears: r.author.memberSinceYears,
      reviewCount: r.author.reviewCount,
      thanksCount: r.author.thanksCount,
    },
    verifiedPurchase: r.verifiedPurchase,
    variantInfo: r.variantInfo,
    createdAtLabel: formatRelativeTimeVi(r.createdAt),
    usedForLabel: r.usedForLabel ?? undefined,
    helpfulCount: r.helpfulCount,
    commentCount: r.commentCount,
    content: r.content,
    images: r.images,
    isHelpfulByCurrentUser: r.isHelpfulByCurrentUser,
    comments: r.comments,
  };
}

export function ProductReviewsContainer({
  slug,
  className,
}: ProductReviewsContainerProps) {
  const [page, setPage] = useState(1);
  const [allReviews, setAllReviews] = useState<Review[]>([]);

  const { data: summaryData, isLoading: isSummaryLoading } =
    useReviewSummary(slug);

  const { data, isLoading, isFetching, isError } = usePublicReviews({
    slug,
    sort: "newest",
    page,
    limit: PAGE_SIZE,
  });

  const toggleHelpful = useToggleReviewHelpful();

  const mergedReviews = useMemo(() => {
    if (!data?.data) return allReviews;
    if (page === 1) return data.data;
    const existingIds = new Set(allReviews.map((r) => r.id));
    const newOnes = data.data.filter((r) => !existingIds.has(r.id));
    return [...allReviews, ...newOnes];
  }, [data, page, allReviews]);

  useEffect(() => {
    if (data?.data && page === 1) {
      setAllReviews(data.data);
    } else if (data?.data && page > 1) {
      setAllReviews((prev) => {
        const existingIds = new Set(prev.map((r) => r.id));
        const newOnes = data.data.filter((r) => !existingIds.has(r.id));
        return [...prev, ...newOnes];
      });
    }
  }, [data, page]);

  const reviews: ProductReview[] = useMemo(
    () => mergedReviews.map(mapReview),
    [mergedReviews],
  );

  const summary = summaryData ?? {
    average: 0,
    total: 0,
    breakdown: { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 },
  };

  if (isLoading || isSummaryLoading) {
    return (
      <div className={className}>
        <Skeleton className="h-6 w-48" />

        <div className="mt-4 sm:max-w-md">
          <Skeleton className="h-4 w-20" />
          <div className="mt-3 flex items-center gap-4">
            <div className="shrink-0 space-y-2">
              <Skeleton className="h-9 w-12" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
            <div className="h-16 w-px shrink-0 bg-border" />
            <div className="flex-1 space-y-1.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Skeleton className="h-3 w-8 shrink-0" />
                  <Skeleton className="h-1.5 flex-1 rounded-full" />
                  <Skeleton className="h-3 w-4 shrink-0" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4">
          <Skeleton className="mb-2 h-4 w-16" />
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-9 w-24 rounded-full" />
            ))}
          </div>
        </div>

        <div className="mt-4 h-px w-full bg-border" />

        <div className="divide-y divide-border">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex gap-4 py-5">
              <Skeleton className="size-10 shrink-0 rounded-full" />
              <div className="min-w-0 flex-1 space-y-2">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1.5">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-40" />
                    <Skeleton className="h-3 w-28" />
                  </div>
                  <div className="space-y-1.5">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
                <Skeleton className="h-4 w-24" />
                <div className="space-y-1.5">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-8 w-24" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <p className="py-6 text-center text-sm text-muted-foreground">
        Không thể tải đánh giá. Vui lòng thử lại sau.
      </p>
    );
  }

  return (
    <ProductReviews
      slug={slug}
      reviews={reviews}
      summary={summary}
      className={className}
      hasMore={!!data?.meta.hasNextPage}
      isLoadingMore={isFetching && page > 1}
      onLoadMore={() => setPage((p) => p + 1)}
      helpfulPendingId={
        toggleHelpful.isPending ? toggleHelpful.variables?.reviewId : null
      }
      onToggleHelpful={(reviewId) => toggleHelpful.mutate({ slug, reviewId })}
    />
  );
}
