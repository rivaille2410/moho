import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/toast";
import { categoriesApi } from "../api/categories-api";
import { queryKeys } from "@/lib/query-keys";

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => categoriesApi.delete(id),
    onSuccess: () => {
      toast.add({ type: "success", description: "Đã xoá danh mục" });
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
