import { useQuery } from "@tanstack/react-query";
import { reviewsApi, QueryReviewsParams, ReviewsResponse } from "../api/reviews-api";
import { queryKeys } from "@/lib/query-keys";

export function useReviews(params: QueryReviewsParams = {}) {
  return useQuery<ReviewsResponse>({
    queryKey: queryKeys.reviews.list(params),
    queryFn: () => reviewsApi.list(params),
  });
}
