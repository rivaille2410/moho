import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "@/components/ui/toast";
import { RemoveProductImagesArgs, type ProductListItem } from "@/types/product";

async function removeProductImages({
  productId,
  imageIds,
}: RemoveProductImagesArgs): Promise<ProductListItem> {
  const res = await fetch(`/api/products/${productId}/images`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ imageIds }),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.message ?? "Không thể xoá ảnh sản phẩm");
  }

  return res.json();
}

export function useRemoveProductImages() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeProductImages,
    onSuccess: (_data, variables) => {
      toast.add({
        type: "success",
        description: `Đã xoá ${variables.imageIds.length} ảnh`,
      });
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
