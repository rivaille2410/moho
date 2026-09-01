import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "@/components/ui/toast";

interface BulkDeleteResponse {
  deletedCount: number;
}

const ERROR_MESSAGES: Record<string, string> = {
  POSTS_NOT_FOUND: "Một số bài viết không tồn tại.",
};

async function bulkDeletePosts(ids: string[]): Promise<BulkDeleteResponse> {
  const res = await fetch("/api/posts/bulk", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ids }),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => null);
    const message =
      (error?.code && ERROR_MESSAGES[error.code]) ??
      error?.message ??
      "Không thể xoá bài viết";
    throw new Error(message);
  }

  return res.json();
}

export function useBulkDeletePosts() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bulkDeletePosts,
    onSuccess: (data) => {
      toast.add({
        type: "success",
        description: `Đã xoá ${data.deletedCount} bài viết`,
      });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
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
