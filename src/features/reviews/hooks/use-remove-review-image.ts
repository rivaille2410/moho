import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Review } from "@/types/review";
import { toast } from "@/components/ui/toast";

async function removeReviewImage({
  id,
  imageId,
}: {
  id: string;
  imageId: string;
}) {
  const res = await fetch(`/api/reviews/${id}/images/${imageId}`, {
    method: "DELETE",
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.message ?? "Không thể xoá ảnh");
  }
  return data as Review;
}

export function useRemoveReviewImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeReviewImage,
    onSuccess: () => {
      toast.add({ type: "success", description: "Đã xoá ảnh" });
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
