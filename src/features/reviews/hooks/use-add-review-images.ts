import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Review } from "@/types/review";
import { toast } from "@/components/ui/toast";

async function addReviewImages({ id, files }: { id: string; files: File[] }) {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));

  const res = await fetch(`/api/reviews/${id}/images`, {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.message ?? "Không thể thêm ảnh");
  }
  return data as Review;
}

export function useAddReviewImages() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addReviewImages,
    onSuccess: () => {
      toast.add({ type: "success", description: "Đã thêm ảnh" });
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
