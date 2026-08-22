import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "@/components/ui/toast";
import { CreateCustomerReviewInput } from "@/types/review";

const ERROR_MESSAGES: Record<string, string> = {
  ALREADY_REVIEWED: "Bạn đã đánh giá sản phẩm này rồi.",
};

async function createCustomerReview({
  slug,
  ...input
}: CreateCustomerReviewInput & { slug: string }) {
  const res = await fetch(`/api/public/products/${slug}/reviews`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  const data = await res.json();
  if (!res.ok) {
    const message =
      (data?.code && ERROR_MESSAGES[data.code]) ??
      data?.message ??
      "Không thể gửi đánh giá";
    throw new Error(message);
  }
  return data;
}

export function useCreateCustomerReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCustomerReview,
    onSuccess: (_data, variables) => {
      toast.add({ type: "success", description: "Cảm ơn bạn đã đánh giá!" });
      queryClient.invalidateQueries({
        queryKey: ["public-reviews", { slug: variables.slug }],
      });
      queryClient.invalidateQueries({
        queryKey: ["review-summary", variables.slug],
      });
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
