import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "@/components/ui/toast";
import { ReviewComment } from "@/types/review-comment";

async function createReviewComment({
  slug,
  reviewId,
  content,
  parentId,
}: {
  slug: string;
  reviewId: string;
  content: string;
  parentId?: string;
}) {
  const res = await fetch(
    `/api/public/products/${slug}/reviews/${reviewId}/comments`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, parentId }),
    },
  );

  const data = await res.json();
  if (!res.ok) {
    throw new Error(
      data?.message ?? "Không thể gửi bình luận, vui lòng đăng nhập",
    );
  }
  return data as ReviewComment;
}

export function useCreateReviewComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createReviewComment,
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
