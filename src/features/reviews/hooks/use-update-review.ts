import { useMutation, useQueryClient } from "@tanstack/react-query";

import { UpdateReviewInput } from "@/types/review";
import { toast } from "@/components/ui/toast";

const ERROR_MESSAGES: Record<string, string> = {
  RATING_OUT_OF_RANGE: "Đánh giá phải từ 1 đến 5 sao.",
  REVIEW_NOT_FOUND: "Không tìm thấy đánh giá.",
};

type UpdateReviewPayload = UpdateReviewInput & { id: string };

async function updateReview({ id, ...input }: UpdateReviewPayload) {
  const res = await fetch(`/api/reviews/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  const data = await res.json();
  if (!res.ok) {
    const message =
      (data?.code && ERROR_MESSAGES[data.code]) ??
      data?.message ??
      "Không thể cập nhật đánh giá";
    throw new Error(message);
  }
  return data;
}

export function useUpdateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateReview,
    onSuccess: () => {
      toast.add({ type: "success", description: "Đã cập nhật đánh giá" });
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
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
