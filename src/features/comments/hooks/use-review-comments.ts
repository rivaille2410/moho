import { useQuery } from "@tanstack/react-query";

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

export async function fetchComments({
  slug,
  reviewId,
  page,
  limit,
}: {
  slug: string;
  reviewId: string;
  page: number;
  limit: number;
}) {
  const search = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  const res = await fetch(
    `/api/public/products/${slug}/reviews/${reviewId}/comments?${search}`,
  );

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.message ?? "Không thể tải bình luận");
  }
  return data as CommentsResponse;
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
    queryFn: () => fetchComments({ slug, reviewId, page, limit }),
    enabled,
  });
}
