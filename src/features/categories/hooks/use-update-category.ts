import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "@/components/ui/toast";
import { CategoryListItem, UpdateCategoryArgs } from "@/types/category";

const ERROR_MESSAGES: Record<string, string> = {
  SLUG_ALREADY_IN_USE: "Đã tồn tại danh mục có tên tương tự.",
  CIRCULAR_CATEGORY_REFERENCE:
    "Không thể chuyển danh mục vào chính nó hoặc danh mục con của nó.",
  INVALID_PARENT: "Danh mục cha không hợp lệ.",
};

async function updateCategory({
  id,
  input,
}: UpdateCategoryArgs): Promise<CategoryListItem> {
  const res = await fetch(`/api/categories/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  const data = await res.json();
  if (!res.ok) {
    const message =
      (data?.code && ERROR_MESSAGES[data.code]) ??
      data?.message ??
      "Không thể cập nhật danh mục";
    throw new Error(message);
  }
  return data;
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCategory,
    onSuccess: () => {
      toast.add({ type: "success", description: "Đã cập nhật danh mục" });
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
