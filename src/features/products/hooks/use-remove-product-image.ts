import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "@/components/ui/toast";
import { RemoveProductImageArgs, type ProductListItem } from "@/types/product";

async function removeProductImage({
  productId,
  imageId,
}: RemoveProductImageArgs): Promise<ProductListItem> {
  const res = await fetch(`/api/products/${productId}/images/${imageId}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.message ?? "Không thể xoá ảnh sản phẩm");
  }

  return res.json();
}

export function useRemoveProductImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeProductImage,
    onSuccess: (_data, variables) => {
      toast.add({ type: "success", description: "Đã xoá ảnh sản phẩm" });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({
        queryKey: ["products", variables.productId],
      });
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
