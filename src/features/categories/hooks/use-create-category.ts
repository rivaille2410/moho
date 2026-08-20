import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "@/components/ui/toast";
import { CreateCategoryInput } from "@/types/category";

const ERROR_MESSAGES: Record<string, string> = {
  SLUG_ALREADY_IN_USE: "Đã tồn tại danh mục có tên tương tự.",
};

async function createCategory(input: CreateCategoryInput) {
  const res = await fetch("/api/categories", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  const data = await res.json();
  if (!res.ok) {
    const message =
      (data?.code && ERROR_MESSAGES[data.code]) ??
      data?.message ??
      "Không thể tạo danh mục";
    throw new Error(message);
  }
  return data;
}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      toast.add({ type: "success", description: "Đã tạo danh mục mới" });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
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
