import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "@/components/ui/toast";
import { CreatePostInput } from "@/types/post";

const ERROR_MESSAGES: Record<string, string> = {
  SLUG_ALREADY_IN_USE: "Đường dẫn (slug) này đã được sử dụng.",
};

async function createPost(input: CreatePostInput) {
  const res = await fetch("/api/posts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  const data = await res.json();
  if (!res.ok) {
    const message =
      (data?.code && ERROR_MESSAGES[data.code]) ??
      data?.message ??
      "Không thể tạo bài viết";
    throw new Error(message);
  }
  return data;
}

export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      toast.add({ type: "success", description: "Đã tạo bài viết mới" });
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
