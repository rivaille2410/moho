import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Cart } from "@/types/cart";
import { toast } from "@/components/ui/toast";

async function clearCart(): Promise<Cart> {
  const res = await fetch("/api/cart", {
    method: "DELETE",
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.message ?? "Không thể xoá giỏ hàng");
  }
  return data;
}

export function useClearCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clearCart,
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
