import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "@/components/ui/toast";
import { Cart, UpdateCartItemInput } from "@/types/cart";

const ERROR_MESSAGES: Record<string, string> = {
  OUT_OF_STOCK: "Số lượng vượt quá tồn kho hiện có.",
};

async function updateCartItem({
  id,
  input,
}: {
  id: string;
  input: UpdateCartItemInput;
}): Promise<Cart> {
  const res = await fetch(`/api/cart/items/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  const data = await res.json();
  if (!res.ok) {
    const message =
      (data?.code && ERROR_MESSAGES[data.code]) ??
      data?.message ??
      "Không thể cập nhật số lượng";
    throw new Error(message);
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

export function useUpdateCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCartItem,
    onMutate: async ({ id, input }) => {
      await queryClient.cancelQueries({ queryKey: ["cart"] });

      const previousCart = queryClient.getQueryData<Cart>(["cart"]);

      if (previousCart) {
        const optimisticCart = recompute({
          ...previousCart,
          items: previousCart.items.map((item) =>
            item.id === id
              ? {
                  ...item,
                  quantity: input.quantity,
                  lineTotal: (Number(item.price) * input.quantity).toString(),
                }
              : item,
          ),
        });
        queryClient.setQueryData(["cart"], optimisticCart);
      }

      return { previousCart };
    },
    onError: (error: Error, _vars, context) => {
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
