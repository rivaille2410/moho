import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "@/components/ui/toast";
import { UpdateVariantArgs, type ProductListItem } from "@/types/product";

async function updateVariant({
  productId,
  variantId,
  input,
}: UpdateVariantArgs): Promise<ProductListItem> {
  const res = await fetch(`/api/products/${productId}/variants/${variantId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.message ?? "Không thể cập nhật biến thể");
  }

  return res.json();
}

export function useUpdateVariant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateVariant,
    onSuccess: (_data, variables) => {
      toast.add({ type: "success", description: "Đã cập nhật biến thể" });
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
