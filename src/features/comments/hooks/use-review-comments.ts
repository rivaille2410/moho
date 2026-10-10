import { useQuery } from "@tanstack/react-query";
import { commentsApi } from "@/features/comments/api/comments-api";
import {
  publicQueryRetryDelay,
  shouldRetryPublicQuery,
} from "@/lib/query-client";

import { CommentsResponse } from "@/types/review-comment";

export function reviewCommentsQueryKey({
  reviewId,
  page,
  limit,
}: {
  reviewId: string;
  page: number;
  limit: number;
}) {
  return ["review-comments", reviewId, page, limit] as const;
}

export async function fetchComments(
  params: {
    slug: string;
    reviewId: string;
    page: number;
    limit: number;
  },
  signal?: AbortSignal,
): Promise<CommentsResponse> {
  return commentsApi.list(
    params.slug,
    params.reviewId,
    params.page,
    params.limit,
    { signal },
  );
}
export function useReviewComments({
  slug,
  reviewId,
  page = 1,
  limit = 10,
  enabled = true,
}: {
  slug: string;
  reviewId: string;
  page?: number;
  limit?: number;
  enabled?: boolean;
}) {
  return useQuery({
    queryKey: reviewCommentsQueryKey({ reviewId, page, limit }),
    queryFn: ({ signal }) =>
      commentsApi.list(slug, reviewId, page, limit, { signal }),
    enabled,
    retry: shouldRetryPublicQuery,
    retryDelay: publicQueryRetryDelay,
  });
}
