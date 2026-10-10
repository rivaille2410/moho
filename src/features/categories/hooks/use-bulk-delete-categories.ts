import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/toast";
import { categoriesApi } from "../api/categories-api";
import { queryKeys } from "@/lib/query-keys";

export function useBulkDeleteCategories() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: string[]) => categoriesApi.bulkDelete(ids),
    onSuccess: (data) => {
      const skippedCount = data.skipped.length;

      toast.add({
        type: skippedCount > 0 ? "warning" : "success",
        description:
          skippedCount > 0
            ? `Đã xoá ${data.deletedCount} danh mục, ${skippedCount} danh mục không thể xoá.`
            : `Đã xoá ${data.deletedCount} danh mục`,
      });

      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
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
