import { apiClient } from "@/lib/api-client";
import { Review, ReviewRatingSummary } from "@/types/review";
import { PaginationMeta } from "@/types/shared";
import type { RequestOptions } from "@/lib/api-client";

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

  publicList(
    productSlug: string,
    params?: {
      rating?: number;
      hasImages?: boolean;
      sort?: "newest" | "oldest";
      page?: number;
      limit?: number;
    },
    options?: Pick<RequestOptions, "signal">,
  ) {
    return apiClient.get<ReviewsResponse>(`/api/public/products/${encodeURIComponent(productSlug)}/reviews`, {
      params,
      ...options,
    });
  },

  summary(productSlug: string, options?: Pick<RequestOptions, "signal">) {
    return apiClient.get<ReviewRatingSummary>(
      `/api/public/products/${encodeURIComponent(productSlug)}/reviews/summary`,
      options,
    );
  },

  toggleHelpful(slug: string, reviewId: string) {
    return apiClient.post<void>(`/api/public/products/${slug}/reviews/${reviewId}/helpful`);
  },
};
