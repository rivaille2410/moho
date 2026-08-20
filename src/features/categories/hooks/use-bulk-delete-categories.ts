import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "@/components/ui/toast";
import { BulkDeleteCategoriesResponse } from "@/types/category";

const ERROR_MESSAGES: Record<string, string> = {
  CATEGORY_HAS_CHILDREN: "Một số danh mục có danh mục con, không thể xoá.",
  CATEGORY_HAS_PRODUCTS: "Một số danh mục vẫn còn sản phẩm, không thể xoá.",
  NOT_FOUND: "Một số danh mục không tồn tại.",
};

async function bulkDeleteCategories(
  ids: string[],
): Promise<BulkDeleteCategoriesResponse> {
  const res = await fetch("/api/categories/bulk", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ids }),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => null);
    const message =
      (error?.code && ERROR_MESSAGES[error.code]) ??
      error?.message ??
      "Không thể xoá danh mục";
    throw new Error(message);
  }

  return res.json();
}

export function useBulkDeleteCategories() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bulkDeleteCategories,
    onSuccess: (data) => {
      const skippedCount = data.skipped.length;

      toast.add({
        type: skippedCount > 0 ? "warning" : "success",
        description:
          skippedCount > 0
            ? `Đã xoá ${data.deletedCount} danh mục, ${skippedCount} danh mục không thể xoá.`
            : `Đã xoá ${data.deletedCount} danh mục`,
      });

      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["categories", "tree"] });
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
