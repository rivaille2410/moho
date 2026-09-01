import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "@/components/ui/toast";
import { type PostStatus } from "@/types/post";

export interface UpdatePostStatusArgs {
  id: string;
  status: PostStatus;
}

async function updatePostStatus({ id, status }: UpdatePostStatusArgs) {
  const res = await fetch(`/api/posts/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });

  if (!res.ok) {
    let message = "Không thể cập nhật trạng thái bài viết";
    try {
      const data = await res.json();
      message = data?.message ?? message;
    } catch {}
    throw new Error(message);
  }

  return res.json();
}

export function useUpdatePostStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updatePostStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.add({ type: "success", description: "Đã cập nhật trạng thái" });
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
