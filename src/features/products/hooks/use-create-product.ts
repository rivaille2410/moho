import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "@/components/ui/toast";
import { CreateProductInput } from "@/types/product";

const ERROR_MESSAGES: Record<string, string> = {
  SKU_ALREADY_IN_USE: "Mã SKU này đã được sử dụng.",
  SLUG_ALREADY_IN_USE: "Đường dẫn (slug) này đã được sử dụng.",
};

async function createProduct(input: CreateProductInput) {
  const res = await fetch("/api/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  const data = await res.json();
  if (!res.ok) {
    const message =
      (data?.code && ERROR_MESSAGES[data.code]) ??
      data?.message ??
      "Không thể tạo sản phẩm";
    throw new Error(message);
  }
  return data;
}

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      toast.add({ type: "success", description: "Đã tạo sản phẩm mới" });
      queryClient.invalidateQueries({ queryKey: ["products"] });
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
