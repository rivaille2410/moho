import { apiClient } from "@/lib/api-client";
import { Review } from "@/types/review";
import { PaginationMeta } from "@/types/shared";

export interface QueryReviewsParams {
  productId?: string;
  page?: number;
  limit?: number;
  rating?: number;
  search?: string;
}

export interface ReviewsResponse {
  data: Review[];
  meta: PaginationMeta;
}

export const reviewsApi = {
  list(params: QueryReviewsParams = {}) {
    return apiClient.get<ReviewsResponse>("/api/reviews", {
      params: {
        productId: params.productId,
        page: params.page,
        limit: params.limit,
        rating: params.rating,
        search: params.search,
      },
    });
  },

  get(id: string) {
    return apiClient.get<Review>(`/api/reviews/${id}`);
  },

  create(input: unknown) {
    return apiClient.post<Review>("/api/reviews", input);
  },

  update(id: string, input: unknown) {
    return apiClient.patch<Review>(`/api/reviews/${id}`, input);
  },

  delete(id: string) {
    return apiClient.delete<void>(`/api/reviews/${id}`);
  },

  publicList(productSlug: string, params?: Record<string, unknown>) {
    return apiClient.get<ReviewsResponse>(`/api/public/products/${productSlug}/reviews`, {
      params: params as Record<string, string | number | boolean>,
    });
  },

  summary(productSlug: string) {
    return apiClient.get<unknown>(`/api/public/products/${productSlug}/reviews/summary`);
  },

  toggleHelpful(slug: string, reviewId: string) {
    return apiClient.post<void>(`/api/public/products/${slug}/reviews/${reviewId}/helpful`);
  },
};
