"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "@/components/ui/toast";
import { type ProductListItem } from "@/types/product";

interface AddProductImageArgs {
  productId: string;
  files: File[];
  variantId?: string;
}

async function addProductImages({
  productId,
  files,
  variantId,
}: AddProductImageArgs): Promise<ProductListItem> {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("files", file);
  });

  const query = variantId ? `?variantId=${variantId}` : "";
  const res = await fetch(`/api/products/${productId}/images${query}`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.message ?? "Không thể tải ảnh lên");
  }

  return res.json();
}

export function useAddProductImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addProductImages,
    onSuccess: (_data, variables) => {
      toast.add({
        type: "success",
        description:
          variables.files.length > 1
            ? `Đã thêm ${variables.files.length} ảnh`
            : "Đã thêm ảnh sản phẩm",
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
