import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "@/components/ui/toast";

const ERROR_MESSAGES: Record<string, string> = {
  REVIEW_NOT_FOUND: "Không tìm thấy đánh giá.",
};

async function deleteReview(id: string) {
  const res = await fetch(`/api/reviews/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    const message =
      (data?.code && ERROR_MESSAGES[data.code]) ??
      data?.message ??
      "Không thể xoá đánh giá";
    throw new Error(message);
  }
  return res.json().catch(() => null);
}

export function useDeleteReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteReview,
    onSuccess: () => {
      toast.add({ type: "success", description: "Đã xoá đánh giá" });
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
