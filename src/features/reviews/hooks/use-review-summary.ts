import { useQuery } from "@tanstack/react-query";
import { reviewsApi } from "@/features/reviews/api/reviews-api";
import {
  publicQueryRetryDelay,
  shouldRetryPublicQuery,
} from "@/lib/query-client";

export function useReviewSummary(slug: string) {
  return useQuery({
    queryKey: ["review-summary", slug],
    queryFn: ({ signal }) => reviewsApi.summary(slug, { signal }),
    enabled: !!slug,
    retry: shouldRetryPublicQuery,
    retryDelay: publicQueryRetryDelay,
  });
}
