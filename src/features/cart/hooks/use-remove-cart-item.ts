import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Cart } from "@/types/cart";
import { toast } from "@/components/ui/toast";

async function removeCartItem(id: string): Promise<Cart> {
  const res = await fetch(`/api/cart/items/${id}`, {
    method: "DELETE",
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.message ?? "Không thể xoá sản phẩm khỏi giỏ hàng");
  }
  return data;
}

function recompute(cart: Cart): Cart {
  const totalItems = cart.items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = cart.items
    .reduce((sum, i) => sum + Number(i.price) * i.quantity, 0)
    .toString();
  return { ...cart, totalItems, subtotal };
}

export function useRemoveCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeCartItem,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["cart"] });

      const previousCart = queryClient.getQueryData<Cart>(["cart"]);

      if (previousCart) {
        const optimisticCart = recompute({
          ...previousCart,
          items: previousCart.items.filter((item) => item.id !== id),
        });
        queryClient.setQueryData(["cart"], optimisticCart);
      }

      return { previousCart };
    },
    onError: (error: Error, _id, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(["cart"], context.previousCart);
      }
      toast.add({
        type: "error",
        description: error.message,
        priority: "high",
      });
    },
    onSuccess: (cart) => {
      queryClient.setQueryData(["cart"], cart);
    },
  });
}
