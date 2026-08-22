import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Review } from "@/types/review";
import { toast } from "@/components/ui/toast";

async function toggleReviewHelpful({
  slug,
  reviewId,
}: {
  slug: string;
  reviewId: string;
}) {
  const res = await fetch(
    `/api/public/products/${slug}/reviews/${reviewId}/helpful`,
    {
      method: "POST",
    },
  );

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.message ?? "Không thể thực hiện, vui lòng đăng nhập");
  }
  return data as Review;
}

export function useToggleReviewHelpful() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleReviewHelpful,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["public-reviews"] });
    },
    onError: (error: Error) => {
      toast.add({
        type: "error",
        description: error.message,
        priority: "high",
      });
    },
  });
}
