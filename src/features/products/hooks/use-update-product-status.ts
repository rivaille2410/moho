import { useMutation, useQueryClient } from "@tanstack/react-query";
import { invalidatePublicProductCaches } from "./invalidate-product-caches";

import {
  type ProductListItem,
  UpdateProductStatusInput,
} from "@/types/product";
import { toast } from "@/components/ui/toast";

async function updateProductStatus({
  id,
  status,
}: UpdateProductStatusInput): Promise<ProductListItem> {
  const res = await fetch(`/api/products/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.message ?? "Không thể đổi trạng thái sản phẩm");
  }

  return res.json();
}

export function useUpdateProductStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProductStatus,
    onSuccess: () => {
      toast.add({ type: "success", description: "Đã đổi trạng thái sản phẩm" });
      queryClient.invalidateQueries({ queryKey: ["products"] });
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
