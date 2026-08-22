import { useQuery } from "@tanstack/react-query";

import { Review } from "@/types/review";

async function fetchReview(id: string) {
  const res = await fetch(`/api/reviews/${id}`);
  if (!res.ok) throw new Error("Không thể tải đánh giá");
  return res.json() as Promise<Review>;
}

export function useReview(id: string) {
  return useQuery({
    queryKey: ["reviews", id],
    queryFn: () => fetchReview(id),
    enabled: !!id,
  });
}
