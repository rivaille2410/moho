import { useMutation, useQueryClient } from "@tanstack/react-query";
import { invalidatePublicProductCaches } from "./invalidate-product-caches";
import { toast } from "@/components/ui/toast";
import { productsApi } from "../api/products-api";
import { queryKeys } from "@/lib/query-keys";
import { CreateProductInput } from "@/types/product";

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateProductInput) => productsApi.create(input),
    onSuccess: () => {
      toast.add({ type: "success", description: "Đã tạo sản phẩm mới" });
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
      void invalidatePublicProductCaches(queryClient);
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
