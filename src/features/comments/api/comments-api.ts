import { apiClient } from "@/lib/api-client";
import { CommentsResponse } from "@/types/review-comment";

export const commentsApi = {
  list(
    slug: string,
    reviewId: string,
    page = 1,
    limit = 10,
    options?: { signal?: AbortSignal | null },
  ) {
    return apiClient.get<CommentsResponse>(
      `/api/public/products/${encodeURIComponent(slug)}/reviews/${encodeURIComponent(reviewId)}/comments`,
      { params: { page, limit }, ...options },
    );
  },

  create(slug: string, reviewId: string, content: string) {
    return apiClient.post(
      `/api/public/products/${slug}/reviews/${reviewId}/comments`,
      { content },
    );
  },

  delete(slug: string, reviewId: string, commentId: string) {
    return apiClient.delete<void>(
      `/api/public/products/${slug}/reviews/${reviewId}/comments/${commentId}`,
    );
  },
};
