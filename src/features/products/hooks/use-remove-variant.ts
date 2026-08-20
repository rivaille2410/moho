import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "@/components/ui/toast";
import { RemoveVariantArgs, type ProductListItem } from "@/types/product";

async function removeVariant({
  productId,
  variantId,
}: RemoveVariantArgs): Promise<ProductListItem> {
  const res = await fetch(`/api/products/${productId}/variants/${variantId}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.message ?? "Không thể xoá biến thể");
  }

  return res.json();
}

export function useRemoveVariant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeVariant,
    onSuccess: (_data, variables) => {
      toast.add({ type: "success", description: "Đã xoá biến thể" });
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
