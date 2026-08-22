import { useQuery } from "@tanstack/react-query";
import { Review, PaginationMeta } from "@/types/review";

interface UsePublicReviewsParams {
  slug: string;
  rating?: number;
  hasImages?: boolean;
  sort?: "newest" | "oldest";
  page?: number;
  limit?: number;
}

async function fetchPublicReviews({ slug, ...params }: UsePublicReviewsParams) {
  const search = new URLSearchParams();
  if (params.rating) search.set("rating", String(params.rating));
  if (params.hasImages) search.set("hasImages", String(params.hasImages));
  if (params.sort) search.set("sort", params.sort);
  if (params.page) search.set("page", String(params.page));
  if (params.limit) search.set("limit", String(params.limit));

  const res = await fetch(
    `/api/public/products/${slug}/reviews?${search.toString()}`,
  );
  if (!res.ok) throw new Error("Không thể tải đánh giá");
  return res.json() as Promise<{ data: Review[]; meta: PaginationMeta }>;
}

export function usePublicReviews(params: UsePublicReviewsParams) {
  return useQuery({
    queryKey: ["public-reviews", params],
    queryFn: () => fetchPublicReviews(params),
    enabled: !!params.slug,
  });
}
