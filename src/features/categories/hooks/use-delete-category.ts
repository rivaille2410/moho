import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "@/components/ui/toast";

const ERROR_MESSAGES: Record<string, string> = {
  CATEGORY_HAS_CHILDREN: "Không thể xoá vì danh mục này còn danh mục con.",
  CATEGORY_HAS_PRODUCTS: "Không thể xoá vì danh mục này vẫn còn sản phẩm.",
};

async function deleteCategory(id: string): Promise<void> {
  const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });

  if (!res.ok) {
    const error = await res.json().catch(() => null);
    const message =
      (error?.code && ERROR_MESSAGES[error.code]) ??
      error?.message ??
      "Không thể xoá danh mục";
    throw new Error(message);
  }
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      toast.add({ type: "success", description: "Đã xoá danh mục" });
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
