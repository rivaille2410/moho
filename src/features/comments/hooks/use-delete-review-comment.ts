import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "@/components/ui/toast";

async function deleteReviewComment({
  slug,
  reviewId,
  commentId,
}: {
  slug: string;
  reviewId: string;
  commentId: string;
}) {
  const res = await fetch(
    `/api/public/products/${slug}/reviews/${reviewId}/comments/${commentId}`,
    { method: "DELETE" },
  );

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(data?.message ?? "Không thể xóa bình luận");
  }
  return data;
}

export function useDeleteReviewComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteReviewComment,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["review-comments", variables.reviewId],
      });
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
