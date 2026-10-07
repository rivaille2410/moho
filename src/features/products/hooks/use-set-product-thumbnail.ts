import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "@/components/ui/toast";
import { SetProductThumbnailArgs, type ProductListItem } from "@/types/product";

async function setProductThumbnail({
  productId,
  imageId,
}: SetProductThumbnailArgs): Promise<ProductListItem> {
  const res = await fetch(
    `/api/products/${productId}/images/${imageId}/thumbnail`,
    { method: "PATCH" },
  );

  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.message ?? "Không thể đặt ảnh đại diện");
  }

  return res.json();
}

export function useSetProductThumbnail() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: setProductThumbnail,
    onSuccess: (_data, variables) => {
      toast.add({ type: "success", description: "Đã đặt ảnh đại diện" });
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
