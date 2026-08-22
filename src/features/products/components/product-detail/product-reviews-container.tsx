"use client";

import { useMemo, useState } from "react";

import { Review } from "@/types/review";
import { formatRelativeTimeVi } from "@/lib/format-relative-time";

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
  };
}

export default function ProductReviewsContainer({
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

  useMemo(() => {
    if (data?.data && page === 1) {
      setAllReviews(data.data);
    } else if (data?.data && page > 1) {
      setAllReviews((prev) => {
        const existingIds = new Set(prev.map((r) => r.id));
        const newOnes = data.data.filter((r) => !existingIds.has(r.id));
        return [...prev, ...newOnes];
      });
    }
  }, [data]);

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
        <div className="h-6 w-40 animate-pulse rounded bg-muted" />
        <div className="mt-4 h-24 animate-pulse rounded bg-muted" />
        <div className="mt-4 space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded bg-muted" />
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
