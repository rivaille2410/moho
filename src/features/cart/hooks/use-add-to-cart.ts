import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "@/components/ui/toast";
import { Cart, AddToCartInput } from "@/types/cart";

const ERROR_MESSAGES: Record<string, string> = {
  PRODUCT_UNAVAILABLE: "Sản phẩm này không còn khả dụng.",
  OUT_OF_STOCK: "Số lượng vượt quá tồn kho hiện có.",
};

async function addToCart(input: AddToCartInput): Promise<Cart> {
  const res = await fetch("/api/cart/items", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  const data = await res.json();
  if (!res.ok) {
    const message =
      (data?.code && ERROR_MESSAGES[data.code]) ??
      data?.message ??
      "Không thể thêm vào giỏ hàng";
    throw new Error(message);
  }
  return data;
}

export function useAddToCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addToCart,
    onSuccess: (cart) => {
      queryClient.setQueryData(["cart"], cart);
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
