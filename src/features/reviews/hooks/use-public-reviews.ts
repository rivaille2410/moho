import { useQuery } from "@tanstack/react-query";
import { reviewsApi } from "@/features/reviews/api/reviews-api";
import {
  publicQueryRetryDelay,
  shouldRetryPublicQuery,
} from "@/lib/query-client";

interface UsePublicReviewsParams {
  slug: string;
  rating?: number;
  hasImages?: boolean;
  sort?: "newest" | "oldest";
  page?: number;
  limit?: number;
}

export function usePublicReviews(params: UsePublicReviewsParams) {
  return useQuery({
    queryKey: ["public-reviews", params],
    queryFn: ({ signal }) =>
      reviewsApi.publicList(
        params.slug,
        {
          rating: params.rating,
          hasImages: params.hasImages,
          sort: params.sort,
          page: params.page,
          limit: params.limit,
        },
        { signal },
      ),
    enabled: !!params.slug,
    retry: shouldRetryPublicQuery,
    retryDelay: publicQueryRetryDelay,
  });
}
