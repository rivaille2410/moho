import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "@/components/ui/toast";
import { type ProductListItem } from "@/types/product";
import { type CreateProductVariantInput } from "@/types/product";

interface AddVariantArgs {
  productId: string;
  input: CreateProductVariantInput;
}

async function addVariant({
  productId,
  input,
}: AddVariantArgs): Promise<ProductListItem> {
  const res = await fetch(`/api/products/${productId}/variants`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.message ?? "Không thể thêm biến thể");
  }

  return res.json();
}

export function useAddVariant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addVariant,
    onSuccess: (_data, variables) => {
      toast.add({ type: "success", description: "Đã thêm biến thể" });
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
