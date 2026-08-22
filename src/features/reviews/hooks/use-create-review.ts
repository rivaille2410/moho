import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "@/components/ui/toast";
import { CreateReviewInput } from "@/types/review";

const ERROR_MESSAGES: Record<string, string> = {
  RATING_OUT_OF_RANGE: "Đánh giá phải từ 1 đến 5 sao.",
  PRODUCT_NOT_FOUND: "Không tìm thấy sản phẩm.",
};

async function createReview(input: CreateReviewInput) {
  const res = await fetch("/api/reviews", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  const data = await res.json();
  if (!res.ok) {
    const message =
      (data?.code && ERROR_MESSAGES[data.code]) ??
      data?.message ??
      "Không thể tạo đánh giá";
    throw new Error(message);
  }
  return data;
}

export function useCreateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createReview,
    onSuccess: () => {
      toast.add({ type: "success", description: "Đã tạo đánh giá mới" });
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
