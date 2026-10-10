import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/toast";
import { categoriesApi } from "../api/categories-api";
import { queryKeys } from "@/lib/query-keys";
import { UpdateCategoryArgs } from "@/types/category";

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: UpdateCategoryArgs) => categoriesApi.update(id, input),
    onSuccess: () => {
      toast.add({ type: "success", description: "Đã cập nhật danh mục" });
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
