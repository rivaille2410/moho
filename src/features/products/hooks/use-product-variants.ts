import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  AddVariantArgs,
  VariantPayload,
  type ProductListItem,
} from "@/types/product";
import { toast } from "@/components/ui/toast";

async function addVariant({
  productId,
  payload,
}: AddVariantArgs): Promise<ProductListItem> {
  const res = await fetch(`/api/products/${productId}/variants`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
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

interface UpdateVariantArgs {
  productId: string;
  variantId: string;
  payload: Partial<VariantPayload>;
}

async function updateVariant({
  productId,
  variantId,
  payload,
}: UpdateVariantArgs): Promise<ProductListItem> {
  const res = await fetch(`/api/products/${productId}/variants/${variantId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
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

interface RemoveVariantArgs {
  productId: string;
  variantId: string;
}

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
