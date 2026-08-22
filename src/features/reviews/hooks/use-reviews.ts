import { useQuery } from "@tanstack/react-query";

import { Review, PaginationMeta } from "@/types/review";

interface UseReviewsParams {
  productId?: string;
  page?: number;
  limit?: number;
  rating?: number;
  search?: string;
}

async function fetchReviews(params: UseReviewsParams) {
  const search = new URLSearchParams();
  if (params.productId) search.set("productId", params.productId);
  if (params.page) search.set("page", String(params.page));
  if (params.limit) search.set("limit", String(params.limit));
  if (params.rating) search.set("rating", String(params.rating));
  if (params.search) search.set("search", params.search);

  const res = await fetch(`/api/reviews?${search.toString()}`);
  if (!res.ok) throw new Error("Không thể tải danh sách đánh giá");
  return res.json() as Promise<{ data: Review[]; meta: PaginationMeta }>;
}

export function useReviews(params: UseReviewsParams = {}) {
  return useQuery({
    queryKey: ["reviews", params],
    queryFn: () => fetchReviews(params),
  });
}
