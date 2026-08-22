import { useQuery } from "@tanstack/react-query";

import { ReviewRatingSummary } from "@/types/review";

async function fetchReviewSummary(slug: string) {
  const res = await fetch(`/api/public/products/${slug}/reviews/summary`);
  if (!res.ok) throw new Error("Không thể tải thống kê đánh giá");
  return res.json() as Promise<ReviewRatingSummary>;
}

export function useReviewSummary(slug: string) {
  return useQuery({
    queryKey: ["review-summary", slug],
    queryFn: () => fetchReviewSummary(slug),
    enabled: !!slug,
  });
}
