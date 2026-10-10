import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/toast";
import { categoriesApi } from "../api/categories-api";
import { queryKeys } from "@/lib/query-keys";
import { CreateCategoryInput } from "@/types/category";

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateCategoryInput) => categoriesApi.create(input),
    onSuccess: () => {
      toast.add({ type: "success", description: "Đã tạo danh mục mới" });
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
